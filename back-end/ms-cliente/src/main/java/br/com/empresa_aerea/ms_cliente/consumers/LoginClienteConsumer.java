package br.com.empresa_aerea.ms_cliente.consumers;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.core.Message;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.empresa_aerea.ms_cliente.dtos.ClienteCadastroResponseDTO;
import br.com.empresa_aerea.ms_cliente.dtos.ClienteDTO;
import br.com.empresa_aerea.ms_cliente.services.ClienteService;

@Component
public class LoginClienteConsumer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    ClienteService service;

    private static final String EXCHANGE_NAME = "saga-exchange";

    @RabbitListener(queues = "ms-cliente-auth")
    public void loginCliente(Message message) throws JsonProcessingException {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ClienteDTO clienteDTO = objectMapper.readValue(message.getBody(), ClienteDTO.class);

            ClienteCadastroResponseDTO clienteResponseDTO = service.loginCliente(clienteDTO);

            MessageProperties props = new MessageProperties();
            props.setContentType("application/json");
            props.setCorrelationId(message.getMessageProperties().getCorrelationId());

            Message responseMessage = new Message(objectMapper.writeValueAsBytes(clienteResponseDTO), props);

            rabbitTemplate.send(EXCHANGE_NAME, "saga-ms-cliente-auth", responseMessage);
        } catch (Exception e) {

            ClienteCadastroResponseDTO errorResponse = new ClienteCadastroResponseDTO(null, null, null, null, null, null, e.getMessage());

            MessageProperties props = new MessageProperties();
            props.setContentType("application/json");
            props.setCorrelationId(message.getMessageProperties().getCorrelationId());

            ObjectMapper objectMapper = new ObjectMapper();
            Message responseMessage = new Message(objectMapper.writeValueAsBytes(errorResponse), props);

            rabbitTemplate.send(EXCHANGE_NAME, "saga-ms-cliente-auth", responseMessage);            
        }
    }
    
}