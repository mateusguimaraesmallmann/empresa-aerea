package br.com.empresa_aerea.saga.services;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.listener.DirectMessageListenerContainer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.empresa_aerea.saga.configurations.SagaMessaging;
import br.com.empresa_aerea.saga.dtos.AuthResponseDTO;
import br.com.empresa_aerea.saga.dtos.ClienteDTO;
import br.com.empresa_aerea.saga.dtos.FuncionarioDTO;
import br.com.empresa_aerea.saga.dtos.LoginRequestDTO;
import br.com.empresa_aerea.saga.dtos.LoginResponseDTO;
import br.com.empresa_aerea.saga.enums.TipoUsuario;
import br.com.empresa_aerea.saga.producers.LoginProducer;
import br.com.empresa_aerea.saga.util.DirectMessageListenerContainerBuilder;

@Service
public class SagaAuthService {

    private static final Logger logger = LoggerFactory.getLogger(SagaAuthService.class);

    @Autowired
    private ConnectionFactory connectionFactory;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private LoginProducer loginProducer;

    private final Map<String, CompletableFuture<Map<String, Object>>> pendingRequests = new ConcurrentHashMap<>();

    private static final long FUTURE_RESPONSE_TIMEOUT = 30;

    public ResponseEntity<Object> login(LoginRequestDTO loginRequestDTO) {
        String correlationIdAuth = UUID.randomUUID().toString();
        String correlationIdCliente = UUID.randomUUID().toString();

        CompletableFuture<Map<String, Object>> responseFutureAuth = new CompletableFuture<>();
        CompletableFuture<Map<String, Object>> responseFutureCliente = new CompletableFuture<>();
        //CompletableFuture<Map<String, Object>> responseFutureFuncionario = new CompletableFuture<>();

        pendingRequests.put(correlationIdAuth, responseFutureAuth);
        pendingRequests.put(correlationIdCliente, responseFutureCliente);

        //DirectMessageListenerContainer containerAuth = DirectMessageListenerContainerBuilder.build(connectionFactory, SagaMessaging.RPL_AUTH_LOGIN, responseFutureAuth);
        //DirectMessageListenerContainer containerCliente = DirectMessageListenerContainerBuilder.build(connectionFactory, SagaMessaging.RPL_AUTH_CLIENTE, responseFutureCliente);
        //DirectMessageListenerContainer containerFuncionario = DirectMessageListenerContainerBuilder.build(connectionFactory, SagaMessaging.RPL_AUTH_FUNCIONARIO, responseFutureFuncionario);

        //containerAuth.start();
        //containerCliente.start();
        //containerFuncionario.start();

        try {
            loginProducer.sendLogin(loginRequestDTO, correlationIdAuth);

            Map<String, Object> responseAuth = responseFutureAuth.get(FUTURE_RESPONSE_TIMEOUT, TimeUnit.SECONDS);
			//containerAuth.stop();

            if(responseAuth.get("errorMessage") != null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário ou senha incorretos!");
            }

            AuthResponseDTO loginResponse = objectMapper.convertValue(responseAuth, AuthResponseDTO.class);

            if(loginResponse.getTipo().equals(TipoUsuario.CLIENTE)){

                ClienteDTO clienteDTO = new ClienteDTO(null, null, loginRequestDTO.getLogin(), null, null, null);

                //loginProducer.sendLoginCliente(clienteDTO);
                loginProducer.sendLoginCliente(clienteDTO, correlationIdCliente);

                Map<String, Object> responseCliente = responseFutureCliente.get(FUTURE_RESPONSE_TIMEOUT, TimeUnit.SECONDS);
			    //containerCliente.stop();

                ClienteDTO cliente = objectMapper.convertValue(responseCliente, ClienteDTO.class);

                LoginResponseDTO response = new LoginResponseDTO(
                    loginResponse.getAccess_token(),
                    "bearer",
                    "CLIENTE",
                    cliente);

                return ResponseEntity.status(HttpStatus.OK).body(response);

            } else {
                /*FuncionarioDTO funcionarioDTO = new FuncionarioDTO(null, null, loginRequestDTO.getLogin(), null, null, false);

                loginProducer.sendLoginFuncionario(funcionarioDTO);
                Map<String, Object> responseFuncionario = responseFutureFuncionario.get(FUTURE_RESPONSE_TIMEOUT, TimeUnit.SECONDS);
			    containerFuncionario.stop();

                FuncionarioDTO funcionario = objectMapper.convertValue(responseFuncionario, FuncionarioDTO.class);

                LoginResponseDTO response = new LoginResponseDTO(
                    loginResponse.getAccess_token(),
                    "bearer",
                    "FUNCIONARIO",
                    funcionario);

                return ResponseEntity.status(HttpStatus.OK).body(response);*/
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Teste fila funcionario");
            }

        } catch (TimeoutException e) {
            logger.error("Timeout na autenticação: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.REQUEST_TIMEOUT).body("Timeout no processamento da autenticação.");
        } catch (Exception e) {
            logger.error("Erro no SagaAuthService: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro no processamento: " + e.getMessage());
        } finally {
            pendingRequests.remove(correlationIdAuth);
            pendingRequests.remove(correlationIdCliente);
            //pendingRequests.remove(correlationIdFuncionario);
        }
    }

    // ==================== LISTENERS DE RESPOSTAS ==========================================================================================================
    @RabbitListener(queues = SagaMessaging.QUEUE_RPL_AUTH_LOGIN)
    public void handleAuthResponse(Message message) {
        handleResponse(message);
    }

    @RabbitListener(queues = SagaMessaging.QUEUE_RPL_AUTH_CLIENTE)
    public void handleClienteResponse(Message message) {
        handleResponse(message);
    }

    @RabbitListener(queues = SagaMessaging.QUEUE_RPL_AUTH_FUNCIONARIO)
    public void handleFuncionarioResponse(Message message) {
        handleResponse(message);
    }

    private void handleResponse(Message message) {
        try {
            String correlationId = new String(message.getMessageProperties().getCorrelationId());

            @SuppressWarnings("unchecked")
            Map<String, Object> response = objectMapper.readValue(message.getBody(), Map.class);

            CompletableFuture<Map<String, Object>> future = pendingRequests.remove(correlationId);
            if (future != null) {
                future.complete(response);
                logger.info("Resposta correlacionada com correlationId {}", correlationId);
            } else {
                logger.warn("Nenhum future pendente para correlationId {}", correlationId);
            }

        } catch (Exception e) {
            logger.error("Erro ao processar mensagem de resposta: {}", e.getMessage(), e);
        }
    }
   
}