package br.com.empresa_aerea.ms_cliente.messaging;

import br.com.empresa_aerea.ms_cliente.dtos.UsuarioCriadoEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class UsuarioProducer {

    private final RabbitTemplate rabbitTemplate;

    public UsuarioProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void enviarUsuarioCriado(UsuarioCriadoEvent evento) {
        rabbitTemplate.convertAndSend("saga-exchange", "usuario.criar", evento);
    }
}

