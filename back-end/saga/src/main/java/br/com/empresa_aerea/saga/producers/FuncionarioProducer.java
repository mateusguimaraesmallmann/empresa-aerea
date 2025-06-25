package br.com.empresa_aerea.saga.producers;

import java.nio.charset.StandardCharsets;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;

import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.empresa_aerea.saga.configurations.SagaMessaging;

@Component
public class FuncionarioProducer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public void sendCadastrarLogin(Object payload, String correlationId) {
        sendMessage(SagaMessaging.CMD_CADASTRAR_LOGIN, payload, correlationId);
    }
    
    public void sendCadastrarFuncionario(Object payload, String correlationId) {
        sendMessage(SagaMessaging.CMD_CADASTRAR_FUNCIONARIO, payload, correlationId);
    }

    public void sendConsultaFuncionarioPorId(Object payload, String correlationId) {
        sendMessage(SagaMessaging.CMD_CONSULTAR_FUNCIONARIO, payload, correlationId);
    }

    public void sendAlterarLogin(Object payload, String correlationId) {
        sendMessage(SagaMessaging.CMD_ALTERAR_LOGIN, payload, correlationId);
    }
    
    public void sendAlterarFuncionario(Object payload, String correlationId) {
        sendMessage(SagaMessaging.CMD_ALTERAR_FUNCIONARIO, payload, correlationId);
    }

    private void sendMessage(String routingKey, Object payload, String correlationId) {
        try {
            String json = objectMapper.writeValueAsString(payload);

            MessageProperties props = new MessageProperties();
            props.setContentType("application/json");
            props.setCorrelationId(correlationId);

            Message message = new Message(json.getBytes(StandardCharsets.UTF_8), props);

            rabbitTemplate.send(SagaMessaging.EXCHANGE, routingKey, message);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar mensagem para " + routingKey, e);
        }
    }
    
}