package br.com.empresa_aerea.ms_funcionario.consumers;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.core.Message;

import br.com.empresa_aerea.ms_funcionario.dtos.FuncionarioDTO;
import br.com.empresa_aerea.ms_funcionario.dtos.FuncionarioResponseDTO;
import br.com.empresa_aerea.ms_funcionario.services.FuncionarioService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class LoginFuncionarioConsumer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private FuncionarioService service;

    private static final String EXCHANGE_NAME = "saga-exchange";

    private static final Logger logger = LoggerFactory.getLogger(LoginFuncionarioConsumer.class);

    @RabbitListener(queues = "ms-funcionario-auth")
    public void loginFuncionario(Message message) throws JsonProcessingException {
        logger.info("Mensagem recebida na fila ms-funcionario-auth");
        
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            FuncionarioDTO funcionarioDTO = objectMapper.readValue(message.getBody(), FuncionarioDTO.class);

            logger.info("Processando login para {}", funcionarioDTO.getEmail());

            FuncionarioResponseDTO funcionarioResponseDTO = service.loginFuncionario(funcionarioDTO);

            MessageProperties props = new MessageProperties();
            props.setContentType("application/json");
            props.setCorrelationId(message.getMessageProperties().getCorrelationId());

            Message responseMessage = new Message(objectMapper.writeValueAsBytes(funcionarioResponseDTO), props);

            rabbitTemplate.send(EXCHANGE_NAME, "saga-ms-funcionario-auth", responseMessage);

            logger.info("Resposta enviada para saga-ms-funcionario-auth");
        } catch (Exception ex) {
            logger.error("Erro no processamento funcionario", ex);

            FuncionarioResponseDTO errorResponse = new FuncionarioResponseDTO(null, null, null, null, null, false, ex.getMessage());

            MessageProperties props = new MessageProperties();
            props.setContentType("application/json");
            props.setCorrelationId(message.getMessageProperties().getCorrelationId());

            ObjectMapper objectMapper = new ObjectMapper();
            Message responseMessage = new Message(objectMapper.writeValueAsBytes(errorResponse), props);

            rabbitTemplate.send(EXCHANGE_NAME, "saga-ms-funcionario-auth", responseMessage);
        }
    }

}