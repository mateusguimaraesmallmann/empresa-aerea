package br.com.empresa_aerea.saga.producers;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import br.com.empresa_aerea.saga.configurations.SagaMessaging;

@Component
public class LoginProducer {

    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    public LoginProducer(RabbitTemplate rabbitTemplate, ObjectMapper objectMapper) {
        this.rabbitTemplate = rabbitTemplate;
        this.objectMapper = objectMapper;
    }

    public void sendLogin(Object payload, String correlationId) {
        sendMessage(SagaMessaging.CMD_AUTH_LOGIN, payload, correlationId);
    }

    public void sendLoginCliente(Object payload, String correlationId) {
        sendMessage(SagaMessaging.CMD_AUTH_CLIENTE, payload, correlationId);
    }

    public void sendLoginFuncionario(Object payload, String correlationId) {
        sendMessage(SagaMessaging.CMD_AUTH_FUNCIONARIO, payload, correlationId);
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