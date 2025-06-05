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

@Component
@RestController
@RequestMapping("/saga/ms-cliente")
@CrossOrigin(origins = "*")
public class SagaClienteController {

    private static final Logger logger = LoggerFactory.getLogger(SagaClienteController.class);
    private static final long FUTURE_TIMEOUT = 60; // segundos

    private final RabbitTemplate rabbitTemplate;
    private final ConnectionFactory connectionFactory;

    public SagaClienteController(RabbitTemplate rabbitTemplate, ConnectionFactory connectionFactory) {
        this.rabbitTemplate = rabbitTemplate;
        this.connectionFactory = connectionFactory;
    }

    @PostMapping("/cadastrar-cliente")
    public ResponseEntity<Object> cadastrarCliente(@Validated @RequestBody Map<String, Object> clienteDto) {
        CompletableFuture<Map<String, Object>> future = new CompletableFuture<>();
        DirectMessageListenerContainer container = DirectMessageListenerContainerBuilder.build(
                connectionFactory,
                SagaMessaging.RPL_CADASTRO_CLIENTE,
                future
        );
        container.start();

        try {
            rabbitTemplate.convertAndSend(
                    SagaMessaging.EXCHANGE,
                    SagaMessaging.CMD_CADASTRAR_CLIENTE,
                    clienteDto
            );

            Map<String, Object> response = future.get(FUTURE_TIMEOUT, TimeUnit.SECONDS);

            if (!response.containsKey("errorMessage")) {
                // Chamar ms-auth para criar usuário
                String email = (String) clienteDto.get("email");

                Map<String, String> dto = Map.of(
                        "email", email,
                        "tipo", "CLIENTE"
                );

                RestTemplate restTemplate = new RestTemplate();
                ResponseEntity<Map> result = restTemplate.postForEntity(
                        "http://ms-auth:9090/auth/autocadastro", dto, Map.class
                );

                if (result.getStatusCode().is2xxSuccessful()) {
                    response.put("senha", result.getBody().get("senha")); // adiciona senha ao retorno
                } else {
                    response.put("errorMessage", "Erro ao criar usuário");
                }
            }

            container.stop();

            if (response.get("errorMessage") != null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            container.stop(); // garantir que pare mesmo em erro
            logger.error("Erro na saga de cadastro de cliente", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro interno: " + e.getMessage()));
        }
    }
}
