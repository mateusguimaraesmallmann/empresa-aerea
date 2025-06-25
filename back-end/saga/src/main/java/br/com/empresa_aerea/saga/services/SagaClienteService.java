package br.com.empresa_aerea.saga.services;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.amqp.core.Message;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.slf4j.Logger;
import br.com.empresa_aerea.saga.configurations.SagaMessaging;
import br.com.empresa_aerea.saga.dtos.ClienteCadastroRequestDTO;
import br.com.empresa_aerea.saga.dtos.ClienteCadastroResponseDTO;
import br.com.empresa_aerea.saga.dtos.ClienteDTO;
import br.com.empresa_aerea.saga.dtos.ClienteResponseDTO;
import br.com.empresa_aerea.saga.dtos.EnderecoCadastroRequestDTO;
import br.com.empresa_aerea.saga.dtos.EnderecoDTO;
import br.com.empresa_aerea.saga.dtos.RegisterRequestDTO;
import br.com.empresa_aerea.saga.enums.TipoUsuario;
import br.com.empresa_aerea.saga.producers.CadastrarClienteProducer;

@Service
public class SagaClienteService {

    private static final Logger logger = LoggerFactory.getLogger(SagaClienteService.class);

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CadastrarClienteProducer cadastrarClienteProducer;

    private final Map<String, CompletableFuture<Map<String, Object>>> pendingRequests = new ConcurrentHashMap<>();

    private static final long FUTURE_RESPONSE_TIMEOUT = 30;

    public ResponseEntity<Object> processarCadastroCliente(ClienteCadastroRequestDTO body) {
        String correlationIdAuth = UUID.randomUUID().toString();
        String correlationIdCliente = UUID.randomUUID().toString();

        CompletableFuture<Map<String, Object>> responseFutureAuth = new CompletableFuture<>();
        CompletableFuture<Map<String, Object>> responseFutureCliente = new CompletableFuture<>();

        pendingRequests.put(correlationIdAuth, responseFutureAuth);
        pendingRequests.put(correlationIdCliente, responseFutureCliente);

        try {
            RegisterRequestDTO registerRequestDTO = new RegisterRequestDTO(body.getEmail(), "", TipoUsuario.CLIENTE);

            EnderecoDTO enderecoDTO = new EnderecoDTO(
                    body.getEndereco().getCep(),
                    body.getEndereco().getUf(),
                    body.getEndereco().getCidade(),
                    body.getEndereco().getBairro(),
                    body.getEndereco().getRua(),
                    body.getEndereco().getNumero(),
                    body.getEndereco().getComplemento());

            ClienteDTO clienteDTO = new ClienteDTO(null, body.getCpf(), body.getEmail(), body.getNome(), body.getSaldo_milhas(), enderecoDTO);

            cadastrarClienteProducer.sendCadastrarLogin(registerRequestDTO, correlationIdAuth);
            cadastrarClienteProducer.sendCadastrarCliente(clienteDTO, correlationIdCliente);

            // Recebe respostas dos dois microsserviços
            Map<String, Object> responseAuth = responseFutureAuth.get(FUTURE_RESPONSE_TIMEOUT, TimeUnit.SECONDS);
            Map<String, Object> responseCliente = responseFutureCliente.get(FUTURE_RESPONSE_TIMEOUT, TimeUnit.SECONDS);

            String errorAuth = (String) responseAuth.get("errorMessage");
            String errorCliente = (String) responseCliente.get("errorMessage");

            if (errorAuth != null || errorCliente != null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro ao relizar o cadastro do usuário.");
            }

            // Converte
            ClienteCadastroResponseDTO clienteResponse = objectMapper.convertValue(responseCliente, ClienteCadastroResponseDTO.class);

            EnderecoCadastroRequestDTO endereco = new EnderecoCadastroRequestDTO(
                clienteResponse.getEndereco().getCep(),
                clienteResponse.getEndereco().getUf(),
                clienteResponse.getEndereco().getCidade(),
                clienteResponse.getEndereco().getBairro(),
                clienteResponse.getEndereco().getRua(),
                clienteResponse.getEndereco().getNumero(),
                clienteResponse.getEndereco().getComplemento());

            ClienteResponseDTO response = new ClienteResponseDTO(
                Integer.valueOf(clienteResponse.getIdCliente().toString()),
                clienteResponse.getCpf(),
                clienteResponse.getEmail(),
                clienteResponse.getNome(),
                clienteResponse.getSaldoMilhas(),
                endereco);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.error("Erro no SagaClienteService: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro no processamento SAGA: " + e.getMessage());
        }
    }

    @RabbitListener(queues = SagaMessaging.QUEUE_RPL_CADASTRAR_LOGIN)
    public void handleAuthResponse(Message message) {
        handleResponse(message);
    }

    @RabbitListener(queues = SagaMessaging.QUEUE_RPL_CADASTRAR_CLIENTE)
    public void handleClienteResponse(Message message) {
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