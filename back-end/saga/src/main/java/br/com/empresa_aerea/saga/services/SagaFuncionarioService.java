package br.com.empresa_aerea.saga.services;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.empresa_aerea.saga.configurations.SagaMessaging;
import br.com.empresa_aerea.saga.dtos.FuncionarioAlteracaoRequestDTO;
import br.com.empresa_aerea.saga.dtos.FuncionarioCadastroRequestDTO;
import br.com.empresa_aerea.saga.dtos.FuncionarioCadastroResponseDTO;
import br.com.empresa_aerea.saga.dtos.FuncionarioConsultaRequestDTO;
import br.com.empresa_aerea.saga.dtos.FuncionarioDTO;
import br.com.empresa_aerea.saga.dtos.RegisterRequestDTO;
import br.com.empresa_aerea.saga.dtos.UpdateLoginRequestDTO;
import br.com.empresa_aerea.saga.enums.TipoUsuario;
import br.com.empresa_aerea.saga.producers.FuncionarioProducer;

@Service
public class SagaFuncionarioService {

    private static final Logger logger = LoggerFactory.getLogger(SagaFuncionarioService.class);

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private FuncionarioProducer funcionarioProducer;

    private final Map<String, CompletableFuture<Map<String, Object>>> pendingRequests = new ConcurrentHashMap<>();

    private static final long FUTURE_RESPONSE_TIMEOUT = 30;

    public ResponseEntity<?> criar(FuncionarioCadastroRequestDTO body) {
        String correlationIdAuth = UUID.randomUUID().toString();
        String correlationIdFuncionario = UUID.randomUUID().toString();

        CompletableFuture<Map<String, Object>> responseFutureAuth = new CompletableFuture<>();
        CompletableFuture<Map<String, Object>> responseFutureFuncionario = new CompletableFuture<>();

        pendingRequests.put(correlationIdAuth, responseFutureAuth);
        pendingRequests.put(correlationIdFuncionario, responseFutureFuncionario);

        try {

            RegisterRequestDTO registerRequestDTO = new RegisterRequestDTO(body.getEmail(), body.getSenha(), TipoUsuario.FUNCIONARIO);
            FuncionarioDTO funcionarioRequestDTO = new FuncionarioDTO(null, body.getCpf(), body.getEmail(), body.getNome(), body.getTelefone(), true);

            funcionarioProducer.sendCadastrarLogin(registerRequestDTO, correlationIdAuth);
            funcionarioProducer.sendCadastrarFuncionario(funcionarioRequestDTO, correlationIdFuncionario);

            // Recebe respostas dos dois microsserviços
            Map<String, Object> responseAuth = responseFutureAuth.get(FUTURE_RESPONSE_TIMEOUT, TimeUnit.SECONDS);
            Map<String, Object> responseFuncionario = responseFutureFuncionario.get(FUTURE_RESPONSE_TIMEOUT, TimeUnit.SECONDS);

            String errorAuth = (String) responseAuth.get("errorMessage");
            String errorFuncionario = (String) responseFuncionario.get("errorMessage");

            if (errorAuth != null || errorFuncionario != null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro ao relizar o cadastro do funcionário.");
            }

            //Converte
            FuncionarioCadastroResponseDTO response = objectMapper.convertValue(responseFuncionario, FuncionarioCadastroResponseDTO.class);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.error("Erro no SagaFuncionarioService: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro no processamento SAGA: " + e.getMessage());
        }
    }

    public ResponseEntity<?> alterar(FuncionarioAlteracaoRequestDTO body, String codigo) {
        String correlationIdConsultaFuncionario = UUID.randomUUID().toString();
        String correlationIdAuth = UUID.randomUUID().toString();
        String correlationIdFuncionario = UUID.randomUUID().toString();

        CompletableFuture<Map<String, Object>> responseFutureConsultaFuncionario = new CompletableFuture<>();
        CompletableFuture<Map<String, Object>> responseFutureAuth = new CompletableFuture<>();
        CompletableFuture<Map<String, Object>> responseFutureFuncionario = new CompletableFuture<>();

        pendingRequests.put(correlationIdConsultaFuncionario, responseFutureConsultaFuncionario);
        pendingRequests.put(correlationIdAuth, responseFutureAuth);
        pendingRequests.put(correlationIdFuncionario, responseFutureFuncionario);

        try {

            FuncionarioConsultaRequestDTO request = new FuncionarioConsultaRequestDTO(Long.valueOf(codigo));

            funcionarioProducer.sendConsultaFuncionarioPorId(request, correlationIdConsultaFuncionario);

            //Aguarda os dados atuais
            Map<String, Object> dadosFuncionarioAntigo = responseFutureConsultaFuncionario.get(FUTURE_RESPONSE_TIMEOUT, TimeUnit.SECONDS);
            //Convert
            FuncionarioDTO cadastroAntigo = objectMapper.convertValue(dadosFuncionarioAntigo, FuncionarioDTO.class);

            UpdateLoginRequestDTO updateLoginDTO = new UpdateLoginRequestDTO(body.getEmail(), cadastroAntigo.getEmail(), body.getSenha(), TipoUsuario.FUNCIONARIO);
            
            Long codigoFunc = Long.valueOf(codigo);
            FuncionarioDTO updateFuncionarioDTO = new FuncionarioDTO(codigoFunc, body.getCpf(), body.getEmail(), body.getNome(), body.getTelefone(), true);

            funcionarioProducer.sendAlterarLogin(updateLoginDTO, correlationIdAuth);
            funcionarioProducer.sendAlterarFuncionario(updateFuncionarioDTO, correlationIdFuncionario);

            Map<String, Object> responseAuth = responseFutureAuth.get(FUTURE_RESPONSE_TIMEOUT, TimeUnit.SECONDS);
            Map<String, Object> responseFuncionario = responseFutureFuncionario.get(FUTURE_RESPONSE_TIMEOUT, TimeUnit.SECONDS);

            String errorAuth = (String) responseAuth.get("errorMessage");
            String errorFuncionario = (String) responseFuncionario.get("errorMessage");

            if (errorAuth != null || errorFuncionario != null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao realizar a atualização do funcionário.");
            }

            FuncionarioCadastroResponseDTO response = objectMapper.convertValue(responseFuncionario, FuncionarioCadastroResponseDTO.class);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            logger.error("Erro no SagaFuncionarioService: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao realizar a atualização do funcionário." + e.getMessage());
        }
    }

    @RabbitListener(queues = SagaMessaging.QUEUE_RPL_CADASTRAR_LOGIN)
    public void handleAuthResponse(Message message) {
        handleResponse(message);
    }

    @RabbitListener(queues = SagaMessaging.QUEUE_RPL_CADASTRAR_FUNCIONARIO)
    public void handleFuncionarioResponse(Message message) {
        handleResponse(message);
    }

    @RabbitListener(queues = SagaMessaging.QUEUE_RPL_ALTERAR_LOGIN)
    public void handleAuthAlterarResponse(Message message) {
        handleResponse(message);
    }

    @RabbitListener(queues = SagaMessaging.QUEUE_RPL_ALTERAR_FUNCIONARIO)
    public void handleFuncionarioAlterarResponse(Message message) {
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