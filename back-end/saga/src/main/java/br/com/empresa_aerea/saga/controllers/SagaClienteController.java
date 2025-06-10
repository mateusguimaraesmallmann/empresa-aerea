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
import org.springframework.web.client.HttpClientErrorException;
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
        Map resultBody;
        String senha;

        try {
            ResponseEntity<Map> result = restTemplate.postForEntity(
                    "http://ms-auth:9090/auth/autocadastro", dtoAuth, Map.class);

            // Se retornar sucesso, obter a senha
            if (!result.getStatusCode().is2xxSuccessful() || result.getBody() == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Erro ao criar usuário"));
            }
            resultBody = result.getBody();
            senha = (String) resultBody.get("senha");
        } catch (HttpClientErrorException.Conflict e) {
            // 409 - E-mail já cadastrado
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "E-mail já cadastrado"));
        } catch (Exception e) {
            logger.error("Erro ao chamar ms-auth: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao criar usuário: " + e.getMessage()));
        }

        // Não deixa seguir se não tem senha
        if (senha == null || senha.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Senha não foi gerada. Cadastro não pode continuar."));
        }

        clienteDto.put("senha", senha);
        clienteDto.put("tipo", "CLIENTE");

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

            Map<String, Object> response = future.get(15, TimeUnit.SECONDS);
            container.stop();

            if (response.get("errorMessage") != null) {
                String error = (String) response.get("errorMessage");
            
                if (error.contains("já cadastrado") || error.contains("já existe")) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body(Map.of("error", error));
                }
            
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", error));
            }
            
            
            // Verifica se a resposta veio com sucesso explícito
            if (!Boolean.TRUE.equals(response.get("ok"))) {
                logger.error("Resposta do ms-cliente sem confirmação de sucesso.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Falha ao processar cadastro do cliente."));
            }
            
            // Retorna sucesso com os dados e a senha
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

