package br.com.empresa_aerea.saga.producers;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import br.com.empresa_aerea.saga.dtos.ClienteDTO;
import br.com.empresa_aerea.saga.dtos.RegisterRequestDTO;

@Component
public class CadastrarClienteProducer {

    private static final String EXCHANGE_NAME = "saga-exchange";

    private final RabbitTemplate rabbitTemplate;

    public CadastrarClienteProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendCadastrarCliente(ClienteDTO clienteDTO) {
        rabbitTemplate.convertAndSend(EXCHANGE_NAME, "ms-cliente-cadastrar-cliente", clienteDTO);
    }

    public void sendCadastrarLogin(RegisterRequestDTO registerRequestDTO) {
        rabbitTemplate.convertAndSend(EXCHANGE_NAME, "ms-auth-cadastrar-login", registerRequestDTO);
    }

}