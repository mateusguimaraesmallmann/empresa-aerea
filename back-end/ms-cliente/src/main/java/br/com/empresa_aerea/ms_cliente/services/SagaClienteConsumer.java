package br.com.empresa_aerea.ms_cliente.services;

import br.com.empresa_aerea.ms_cliente.models.Cliente;
import br.com.empresa_aerea.ms_cliente.models.Endereco;
import br.com.empresa_aerea.ms_cliente.messaging.SagaMessaging;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Random;

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
    public void receberCadastroCliente(Message message) {
        try {
            // Lê o payload JSON enviado pelo Saga
            String body = new String(message.getBody());
            Map<String, Object> dados = objectMapper.readValue(body, Map.class);

            Map<String, Object> enderecoMap = (Map<String, Object>) dados.get("endereco");

            Cliente cliente = new Cliente();
            cliente.setCpf((String) dados.get("cpf"));
            cliente.setNome((String) dados.get("nome"));
            cliente.setEmail((String) dados.get("email"));

            Endereco endereco = new Endereco();
            endereco.setCep((String) enderecoMap.get("cep"));
            endereco.setRua((String) enderecoMap.get("rua"));
            endereco.setNumero((String) enderecoMap.get("numero"));
            endereco.setComplemento((String) enderecoMap.get("complemento"));
            endereco.setCidade((String) enderecoMap.get("cidade"));
            endereco.setEstado((String) enderecoMap.get("estado"));
            endereco.setBairro((String) enderecoMap.get("bairro"));

            cliente.setEndereco(endereco);

            // Geração única e consistente da senha
            String senhaGerada = gerarSenha(8);

            // Salvar o cliente com a senha gerada
            clienteService.salvar(cliente, senhaGerada);

            // Envia para o Auth criar o usuário
            rabbitTemplate.convertAndSend(
                SagaMessaging.EXCHANGE,
                "usuario.criar",
                Map.of(
                    "email", cliente.getEmail(),
                    "senha", senhaGerada,
                    "tipo", "CLIENTE"
                )
            );

            // Responde à saga na fila replyTo, usando o correlationId
            String replyTo = message.getMessageProperties().getReplyTo();
            String correlationId = message.getMessageProperties().getCorrelationId();

            MessageProperties props = new MessageProperties();
            if (correlationId != null) {
                props.setCorrelationId(correlationId);
            }

            Message replyMsg = new Message(
                objectMapper.writeValueAsBytes(
                    Map.of(
                        "senha", senhaGerada,
                        "email", cliente.getEmail(),
                        "cpf", cliente.getCpf(),
                        "nome", cliente.getNome()
                    )
                ),
                props
            );

            // Envia resposta para a saga na fila replyTo
            rabbitTemplate.send(replyTo, replyMsg);

        } catch (Exception e) {
            e.printStackTrace();

            // Em caso de erro, responde também na fila replyTo para evitar timeout no Saga
            try {
                String replyTo = message.getMessageProperties().getReplyTo();
                String correlationId = message.getMessageProperties().getCorrelationId();

                MessageProperties props = new MessageProperties();
                if (correlationId != null) {
                    props.setCorrelationId(correlationId);
                }

                Message replyMsg = new Message(
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

    private String gerarSenha(int tamanho) {
        String caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder senha = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < tamanho; i++) {
            senha.append(caracteres.charAt(random.nextInt(caracteres.length())));
        }
        return senha.toString();
    }
}
