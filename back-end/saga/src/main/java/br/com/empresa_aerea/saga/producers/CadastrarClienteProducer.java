package br.com.empresa_aerea.saga.producers;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import br.com.empresa_aerea.saga.configurations.SagaMessaging;
import br.com.empresa_aerea.saga.dtos.ClienteDTO;
import br.com.empresa_aerea.saga.dtos.RegisterRequestDTO;

@Component
public class CadastrarClienteProducer {

    private final RabbitTemplate rabbitTemplate;

    public CadastrarClienteProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendCadastrarCliente(ClienteDTO clienteDTO) {
        rabbitTemplate.convertAndSend(SagaMessaging.EXCHANGE, SagaMessaging.CMD_CADASTRAR_CLIENTE, clienteDTO);
    }

    public void sendCadastrarLogin(RegisterRequestDTO registerRequestDTO) {
        rabbitTemplate.convertAndSend(SagaMessaging.EXCHANGE, SagaMessaging.CMD_CADASTRAR_LOGIN, registerRequestDTO);
    }

}