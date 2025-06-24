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
public class CadastrarClienteProducer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    //public void sendCadastrarCliente(ClienteDTO clienteDTO) {
    //    rabbitTemplate.convertAndSend(SagaMessaging.EXCHANGE, SagaMessaging.CMD_CADASTRAR_CLIENTE, clienteDTO);
    //}

    public void sendCadastrarCliente(Object payload, String correlationId) {
        sendMessage(SagaMessaging.CMD_CADASTRAR_CLIENTE, payload, correlationId);
    }

    //public void sendCadastrarLogin(RegisterRequestDTO registerRequestDTO) {
    //    rabbitTemplate.convertAndSend(SagaMessaging.EXCHANGE, SagaMessaging.CMD_CADASTRAR_LOGIN, registerRequestDTO);
    //}

    public void sendCadastrarLogin(Object payload, String correlationId) {
        sendMessage(SagaMessaging.CMD_CADASTRAR_LOGIN, payload, correlationId);
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