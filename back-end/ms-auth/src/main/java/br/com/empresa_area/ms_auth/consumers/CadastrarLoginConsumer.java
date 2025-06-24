package br.com.empresa_area.ms_auth.consumers;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.core.Message;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.empresa_area.ms_auth.dtos.RegisterRequestDTO;
import br.com.empresa_area.ms_auth.dtos.RegisterResponseDTO;
import br.com.empresa_area.ms_auth.services.AuthorizationService;

@Component
public class CadastrarLoginConsumer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private AuthorizationService authorizationService;

    private static final String EXCHANGE_NAME = "saga-exchange";

    @RabbitListener(queues = "ms-auth-cadastrar-login")
    public void cadastrarLogin(Message message) throws JsonProcessingException {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            RegisterRequestDTO registerRequestCadastrarDTO = objectMapper.readValue(message.getBody(), RegisterRequestDTO.class);

            RegisterResponseDTO registerResponseDTO = authorizationService.cadastrarLogin(registerRequestCadastrarDTO);

            MessageProperties props = new MessageProperties();
            props.setContentType("application/json");
            props.setCorrelationId(message.getMessageProperties().getCorrelationId());

            Message responseMessage = new Message(objectMapper.writeValueAsBytes(registerResponseDTO), props);

            rabbitTemplate.send(EXCHANGE_NAME, "saga-ms-auth-cadastrar-login", responseMessage);
        } catch (Exception e) {
            RegisterResponseDTO errorResponse = new RegisterResponseDTO(null, null, e.getMessage());

            MessageProperties props = new MessageProperties();
            props.setContentType("application/json");
            props.setCorrelationId(message.getMessageProperties().getCorrelationId());

            ObjectMapper objectMapper = new ObjectMapper();
            Message responseMessage = new Message(objectMapper.writeValueAsBytes(errorResponse), props);

            rabbitTemplate.send(EXCHANGE_NAME, "saga-ms-auth-cadastrar-login", responseMessage);
        }
    }
    
}