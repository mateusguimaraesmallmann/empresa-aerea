package br.com.empresa_aerea.saga.controllers;

import br.com.empresa_aerea.saga.messaging.SagaMessaging;
import br.com.empresa_aerea.saga.util.DirectMessageListenerContainerBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.amqp.rabbit.listener.DirectMessageListenerContainer;

import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

@Component
@RestController
@RequestMapping("/saga/ms-cliente")
@CrossOrigin(origins = "*")
public class SagaClienteController {

    private static final Logger logger = LoggerFactory.getLogger(SagaClienteController.class);

    private final RabbitTemplate rabbitTemplate;
    private final ConnectionFactory connectionFactory;

    public SagaClienteController(RabbitTemplate rabbitTemplate, ConnectionFactory connectionFactory) {
        this.rabbitTemplate = rabbitTemplate;
        this.connectionFactory = connectionFactory;
    }

    @PostMapping("/cadastrar-cliente")
    public ResponseEntity<Object> cadastrarCliente(@Validated @RequestBody Map<String, Object> clienteDto) {
        String email = (String) clienteDto.get("email");
        String nome = (String) clienteDto.get("nome");
        String cpf = (String) clienteDto.get("cpf");

        Map<String, String> dtoAuth = Map.of(
                "email", email,
                "tipo", "CLIENTE");

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> result = restTemplate.postForEntity(
                "http://ms-auth:9090/auth/autocadastro", dtoAuth, Map.class);

        if (!result.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao criar usuário"));
        }

        String senha = (String) result.getBody().get("senha");
        clienteDto.put("senha", senha); // Inclui a senha no DTO
        clienteDto.put("tipo", "CLIENTE"); // Inclui o tipo para o ms-cliente

        // LOG antes do envio para RabbitMQ
        logger.info("Enviando comando para cadastrar cliente via RabbitMQ, email={}, cpf={}", email, cpf);

        try {
            rabbitTemplate.convertAndSend(
                    SagaMessaging.EXCHANGE,
                    SagaMessaging.CMD_CADASTRAR_CLIENTE,
                    clienteDto);

            // Aguarda confirmação por RabbitMQ
            CompletableFuture<Map<String, Object>> future = new CompletableFuture<>();
            DirectMessageListenerContainer container = DirectMessageListenerContainerBuilder.build(
                    connectionFactory,
                    SagaMessaging.RPL_CADASTRO_CLIENTE,
                    future);
            container.start();

            Map<String, Object> response = future.get(15, TimeUnit.SECONDS); // <= Timeout menor
            container.stop();

            if (response.get("errorMessage") != null) {
                logger.error("Erro recebido do ms-cliente: " + response.get("errorMessage"));
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            response.put("senha", senha);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (TimeoutException e) {
            logger.error("Timeout ao aguardar resposta do ms-cliente");
            return ResponseEntity.status(HttpStatus.REQUEST_TIMEOUT)
                    .body(Map.of("error", "Timeout ao cadastrar cliente. Tente novamente."));
        } catch (Exception e) {
            logger.error("Erro na saga de cadastro de cliente", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro interno: " + e.getMessage()));
        }
    }

}
