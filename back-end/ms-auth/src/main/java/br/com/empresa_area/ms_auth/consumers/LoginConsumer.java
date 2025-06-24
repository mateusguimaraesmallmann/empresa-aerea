package br.com.empresa_area.ms_auth.consumers;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import br.com.empresa_area.ms_auth.dtos.AuthResponseDTO;
import br.com.empresa_area.ms_auth.dtos.LoginRequestDTO;
import br.com.empresa_area.ms_auth.services.AuthorizationService;

@Component
public class LoginConsumer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private AuthorizationService service;

    private static final String EXCHANGE_NAME = "saga-exchange";

    @RabbitListener(queues = "auth-login")
    public void login(Message message) throws JsonProcessingException {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            LoginRequestDTO loginRequestDTO = objectMapper.readValue(message.getBody(), LoginRequestDTO.class);

            AuthResponseDTO authResponseDTO = service.login(loginRequestDTO);

            MessageProperties props = new MessageProperties();
            props.setContentType("application/json");
            props.setCorrelationId(message.getMessageProperties().getCorrelationId());

            Message responseMessage = new Message(objectMapper.writeValueAsBytes(authResponseDTO), props);

            rabbitTemplate.send(EXCHANGE_NAME, "saga-auth-login", responseMessage);
        } catch (Exception e) {

            AuthResponseDTO errorResponse = new AuthResponseDTO(null, null, e.getMessage());

            MessageProperties props = new MessageProperties();
            props.setContentType("application/json");
            props.setCorrelationId(message.getMessageProperties().getCorrelationId());

            ObjectMapper objectMapper = new ObjectMapper();
            Message responseMessage = new Message(objectMapper.writeValueAsBytes(errorResponse), props);

            rabbitTemplate.send(EXCHANGE_NAME, "saga-auth-login", responseMessage);
        } 
    }
    
}