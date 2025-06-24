package br.com.empresa_aerea.ms_cliente.consumers;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.core.Message;

import br.com.empresa_aerea.ms_cliente.dtos.ClienteCadastroResponseDTO;
import br.com.empresa_aerea.ms_cliente.dtos.ClienteDTO;
import br.com.empresa_aerea.ms_cliente.services.ClienteService;

@Component
public class CadastrarClienteConsumer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    ClienteService clienteService;

    private static final String EXCHANGE_NAME = "saga-exchange";

    @RabbitListener(queues = "ms-cliente-cadastrar-cliente")
    //public void cadastrarCliente(ClienteDTO clienteDto) {
    public void cadastrarCliente(Message message) throws JsonProcessingException {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ClienteDTO clienteDto = objectMapper.readValue(message.getBody(), ClienteDTO.class);

            ClienteCadastroResponseDTO clienteCadastroResponseDTO = clienteService.cadastrarCliente(clienteDto);

            MessageProperties props = new MessageProperties();
            props.setContentType("application/json");
            props.setCorrelationId(message.getMessageProperties().getCorrelationId());

            Message responseMessage = new Message(objectMapper.writeValueAsBytes(clienteCadastroResponseDTO), props);

            rabbitTemplate.send(EXCHANGE_NAME, "saga-ms-cliente-cadastrar-cliente", responseMessage);
            //rabbitTemplate.convertAndSend(EXCHANGE_NAME, "saga-ms-cliente-cadastrar-cliente", clienteCadastroResponseDTO);
        } catch (Exception e) {
            ClienteCadastroResponseDTO errorResponse = new ClienteCadastroResponseDTO(null, null, null, null, null, null, e.getMessage());

            MessageProperties props = new MessageProperties();
            props.setContentType("application/json");
            props.setCorrelationId(message.getMessageProperties().getCorrelationId());

            ObjectMapper objectMapper = new ObjectMapper();
            Message responseMessage = new Message(objectMapper.writeValueAsBytes(errorResponse), props);
            
            rabbitTemplate.send(EXCHANGE_NAME, "saga-ms-cliente-cadastrar-cliente", responseMessage); 
            //rabbitTemplate.convertAndSend(EXCHANGE_NAME, "saga-ms-cliente-cadastrar-cliente", new ClienteCadastroResponseDTO(null, null, null, null, null, null, e.getMessage()));
        }
    }
    
}