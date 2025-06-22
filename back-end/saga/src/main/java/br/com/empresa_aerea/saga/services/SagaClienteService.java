package br.com.empresa_aerea.saga.services;

import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.listener.DirectMessageListenerContainer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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
import br.com.empresa_aerea.saga.dtos.RegisterResponseDTO;
import br.com.empresa_aerea.saga.enums.TipoUsuario;
import br.com.empresa_aerea.saga.producers.CadastrarClienteProducer;
import br.com.empresa_aerea.saga.util.DirectMessageListenerContainerBuilder;

@Service
public class SagaClienteService {

    private static final Logger logger = LoggerFactory.getLogger(SagaClienteService.class);

    @Autowired
    private ConnectionFactory connectionFactory;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CadastrarClienteProducer cadastrarClienteProducer;

    private static final long FUTURE_RESPONSE_TIMEOUT = 30;

    public ResponseEntity<Object> processarCadastroCliente(ClienteCadastroRequestDTO body) {

        logger.info("Recebido para processamento SAGA: {}", body);

        CompletableFuture<Map<String, Object>> responseFutureAuth = new CompletableFuture<>();
        CompletableFuture<Map<String, Object>> responseFutureCliente = new CompletableFuture<>();

        DirectMessageListenerContainer containerAuth = DirectMessageListenerContainerBuilder.build(connectionFactory, SagaMessaging.RPL_CADASTRAR_LOGIN, responseFutureAuth);
        DirectMessageListenerContainer containerCliente = DirectMessageListenerContainerBuilder.build(connectionFactory, SagaMessaging.RPL_CADASTRAR_CLIENTE, responseFutureCliente);

        containerAuth.start();
        containerCliente.start();

        try {
            RegisterRequestDTO registerRequestDTO = new RegisterRequestDTO(body.getEmail(), "", TipoUsuario.CLIENTE);

            EnderecoDTO enderecoDTO = new EnderecoDTO(
                    body.getEndereco().getCep(),
                    body.getEndereco().getEstado(),
                    body.getEndereco().getCidade(),
                    body.getEndereco().getBairro(),
                    body.getEndereco().getRua(),
                    body.getEndereco().getNumero(),
                    body.getEndereco().getComplemento());

            ClienteDTO clienteDTO = new ClienteDTO(null, body.getCpf(), body.getEmail(), body.getNome(), body.getSaldo_milhas(), enderecoDTO);

            // ENVIA para ms-auth e ms-cliente
            cadastrarClienteProducer.sendCadastrarLogin(registerRequestDTO);
            cadastrarClienteProducer.sendCadastrarCliente(clienteDTO);

            // Recebe respostas dos dois microsserviços
            Map<String, Object> responseAuth = responseFutureAuth.get(FUTURE_RESPONSE_TIMEOUT, TimeUnit.SECONDS);
            containerAuth.stop();

            Map<String, Object> responseCliente = responseFutureCliente.get(FUTURE_RESPONSE_TIMEOUT, TimeUnit.SECONDS);
            containerCliente.stop();

            String errorAuth = (String) responseAuth.get("errorMessage");
            String errorCliente = (String) responseCliente.get("errorMessage");

            if (errorAuth != null || errorCliente != null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Mensagem de erro de teste...");
            }

            // Converte o response do ms-auth para RegisterResponseDTO (para pegar a senha)
            RegisterResponseDTO registerResponseDTO = objectMapper.convertValue(responseAuth, RegisterResponseDTO.class);

            // Converte o response do ms-cliente
            ClienteCadastroResponseDTO clienteResponse = objectMapper.convertValue(responseCliente, ClienteCadastroResponseDTO.class);

            // Propague a senha gerada para o response final!
            clienteResponse.setSenha(registerResponseDTO.getSenha());

            EnderecoCadastroRequestDTO endereco = new EnderecoCadastroRequestDTO(
                    clienteResponse.getEndereco().getCep(),
                    clienteResponse.getEndereco().getEstado(),
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
                    endereco,
                    registerResponseDTO.getSenha()
            );

            // Cria um Map para devolver também a senha
            Map<String, Object> respostaFinal = new java.util.HashMap<>();
            respostaFinal.put("cliente", response);
            respostaFinal.put("senhaGerada", registerResponseDTO.getSenha());

            return ResponseEntity.status(HttpStatus.CREATED).body(respostaFinal);

        } catch (Exception e) {
            logger.error("Erro no SagaClienteService: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro no processamento SAGA: " + e.getMessage());
        }
    }
}