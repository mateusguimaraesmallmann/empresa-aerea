package br.com.empresa_aerea.saga.controllers;

import br.com.empresa_aerea.saga.dtos.CadastroClienteResponse;
import br.com.empresa_aerea.saga.dtos.ClienteDTO;
import br.com.empresa_aerea.saga.dtos.RegisterRequestDTO;
import br.com.empresa_aerea.saga.enums.TipoUsuario;
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

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.amqp.rabbit.listener.DirectMessageListenerContainer;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@Component
@RestController
@RequestMapping("/saga/ms-cliente")
@CrossOrigin(origins = "*")
public class SagaClienteController {

    private static final Logger logger = LoggerFactory.getLogger(SagaClienteController.class);

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private ConnectionFactory connectionFactory;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String EXCHANGE_NAME = "saga-exchange";
    private static final long FUTURE_RESPONSE_TIMEOUT = 30;

    @PostMapping("/clientes")
    public ResponseEntity<Object> cadastrarCliente(@Validated @RequestBody ClienteDTO clienteDTO) {
        CompletableFuture<Map<String, Object>> responseFutureAuth = new CompletableFuture<>();
        CompletableFuture<Map<String, Object>> responseFutureCliente = new CompletableFuture<>();

        DirectMessageListenerContainer containerAuth = DirectMessageListenerContainerBuilder.build(connectionFactory, "saga-ms-auth-cadastrar-login", responseFutureAuth);
        DirectMessageListenerContainer containerCliente = DirectMessageListenerContainerBuilder.build(connectionFactory, "saga-ms-cliente-cadastrar-cliente", responseFutureCliente);

        containerAuth.start();
        containerCliente.start();

        try {

            RegisterRequestDTO registerRequestDTO = new RegisterRequestDTO();
            registerRequestDTO.setEmail(clienteDTO.getEmail());
            registerRequestDTO.setSenha("");
            registerRequestDTO.setTipo(TipoUsuario.CLIENTE);

            rabbitTemplate.convertAndSend(EXCHANGE_NAME, "ms-auth-cadastrar-login", registerRequestDTO);
            rabbitTemplate.convertAndSend(EXCHANGE_NAME, "ms-cliente-cadastrar-cliente", clienteDTO);

            Map<String, Object> executionResponseJsonAuth = responseFutureAuth.get(FUTURE_RESPONSE_TIMEOUT, TimeUnit.SECONDS);
            containerAuth.stop();

            Map<String, Object> executionResponseJsonCliente = responseFutureCliente.get(FUTURE_RESPONSE_TIMEOUT, TimeUnit.SECONDS);
            containerCliente.stop();

            String errorMessageAuth = (String) executionResponseJsonAuth.get("errorMessage");
            String errorMessageCliente = (String) executionResponseJsonCliente.get("errorMessage");

            if (errorMessageAuth != null || errorMessageCliente != null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            ClienteDTO clienteResponse = objectMapper.convertValue(executionResponseJsonCliente, ClienteDTO.class);

            CadastroClienteResponse response = new CadastroClienteResponse(
                clienteResponse.getIdCliente(),
                clienteResponse.getCpf(),
                clienteResponse.getEmail(),
                clienteResponse.getNome(),
                clienteResponse.getSaldoMilhas(),
                clienteResponse.getEndereco());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch(Exception e){
            logger.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("SAGA: cadastro de cliente com erro ao iniciar o processo: " + e.getMessage());
        }
    }

}