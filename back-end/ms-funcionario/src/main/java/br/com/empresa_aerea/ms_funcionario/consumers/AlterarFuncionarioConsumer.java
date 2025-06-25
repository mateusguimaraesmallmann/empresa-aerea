package br.com.empresa_aerea.ms_funcionario.consumers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.amqp.core.Message;

import br.com.empresa_aerea.ms_funcionario.dtos.FuncionarioDTO;
import br.com.empresa_aerea.ms_funcionario.dtos.FuncionarioResponseDTO;
import br.com.empresa_aerea.ms_funcionario.services.FuncionarioService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class AlterarFuncionarioConsumer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private FuncionarioService service;

    private static final String EXCHANGE_NAME = "saga-exchange";

    private static final Logger logger = LoggerFactory.getLogger(CadastrarFuncionarioConsumer.class);

    @RabbitListener(queues = "ms-funcionario-alterar-funcionario")
    public void alterarFuncionario(Message message) throws JsonProcessingException {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            FuncionarioDTO funcionarioDTO = objectMapper.readValue(message.getBody(), FuncionarioDTO.class);

            FuncionarioResponseDTO funcionarioResponseDTO = service.alterarFuncionario(funcionarioDTO);

            MessageProperties props = new MessageProperties();
            props.setContentType("application/json");
            props.setCorrelationId(message.getMessageProperties().getCorrelationId());

            Message responseMessage = new Message(objectMapper.writeValueAsBytes(funcionarioResponseDTO), props);

            rabbitTemplate.send(EXCHANGE_NAME, "saga-ms-funcionario-alterar-funcionario", responseMessage);
        } catch (Exception ex) {
            logger.error("Erro no processamento funcionario", ex);

            FuncionarioResponseDTO errorResponse = new FuncionarioResponseDTO(null, null, null, null, null, false, ex.getMessage());

            MessageProperties props = new MessageProperties();
            props.setContentType("application/json");
            props.setCorrelationId(message.getMessageProperties().getCorrelationId());

            ObjectMapper objectMapper = new ObjectMapper();
            Message responseMessage = new Message(objectMapper.writeValueAsBytes(errorResponse), props);

            rabbitTemplate.send(EXCHANGE_NAME, "saga-ms-funcionario-alterar-funcionario", responseMessage);
        }
    }
    
}