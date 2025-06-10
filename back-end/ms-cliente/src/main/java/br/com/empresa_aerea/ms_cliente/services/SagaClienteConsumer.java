package br.com.empresa_aerea.ms_cliente.services;

import br.com.empresa_aerea.ms_cliente.models.Cliente;
import br.com.empresa_aerea.ms_cliente.models.Endereco;
import br.com.empresa_aerea.ms_cliente.messaging.SagaMessaging;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class SagaClienteConsumer {

    private final ClienteService clienteService;
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SagaClienteConsumer(ClienteService clienteService, RabbitTemplate rabbitTemplate) {
        this.clienteService = clienteService;
        this.rabbitTemplate = rabbitTemplate;
    }

    @RabbitListener(queues = SagaMessaging.CMD_CADASTRAR_CLIENTE)
    public void receberCadastroCliente(Map<String, Object> dados, org.springframework.amqp.core.Message message) {
        try {
            Map<String, Object> enderecoMap = (Map<String, Object>) dados.get("endereco");

            Cliente cliente = new Cliente();
            cliente.setCpf((String) dados.get("cpf"));
            cliente.setNome((String) dados.get("nome"));
            cliente.setEmail((String) dados.get("email"));
            cliente.setTipo((String) dados.get("tipo"));

            Endereco endereco = new Endereco();
            endereco.setCep((String) enderecoMap.get("cep"));
            endereco.setRua((String) enderecoMap.get("rua"));
            endereco.setNumero((String) enderecoMap.get("numero"));
            endereco.setComplemento((String) enderecoMap.get("complemento"));
            endereco.setCidade((String) enderecoMap.get("cidade"));
            endereco.setEstado((String) enderecoMap.get("estado"));
            endereco.setBairro((String) enderecoMap.get("bairro"));

            cliente.setEndereco(endereco);

            // Usa a senha recebida do Saga (ms-auth)
            String senhaRecebida = (String) dados.get("senha");
            if (senhaRecebida == null || senhaRecebida.isEmpty()) {
                throw new IllegalArgumentException("Senha não recebida do Saga!");
            }
            cliente.setSenha(senhaRecebida);
            clienteService.salvar(cliente, senhaRecebida);

            // Responde à saga na fila replyTo, usando o correlationId
            String replyTo = message.getMessageProperties().getReplyTo();
            String correlationId = message.getMessageProperties().getCorrelationId();

            MessageProperties props = new MessageProperties();
            if (correlationId != null) {
                props.setCorrelationId(correlationId);
            }
            props.setContentType(MessageProperties.CONTENT_TYPE_JSON);

            org.springframework.amqp.core.Message replyMsg = new org.springframework.amqp.core.Message(
                objectMapper.writeValueAsBytes(
                    Map.of(
                        "ok", true,
                        "senha", senhaRecebida,
                        "email", cliente.getEmail(),
                        "cpf", cliente.getCpf(),
                        "nome", cliente.getNome()
                    )
                ),
                props
            );

            rabbitTemplate.send(replyTo, replyMsg);

        } catch (Exception e) {
            e.printStackTrace();

            try {
                String replyTo = message.getMessageProperties().getReplyTo();
                String correlationId = message.getMessageProperties().getCorrelationId();

                MessageProperties props = new MessageProperties();
                if (correlationId != null) {
                    props.setCorrelationId(correlationId);
                }
                props.setContentType(MessageProperties.CONTENT_TYPE_JSON);

                org.springframework.amqp.core.Message replyMsg = new org.springframework.amqp.core.Message(
                    objectMapper.writeValueAsBytes(
                        Map.of("errorMessage", "Erro ao processar cadastro: " + e.getMessage())
                    ),
                    props
                );
                rabbitTemplate.send(replyTo, replyMsg);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }
}



