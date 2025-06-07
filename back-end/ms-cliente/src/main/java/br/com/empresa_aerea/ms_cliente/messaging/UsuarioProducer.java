package br.com.empresa_aerea.ms_cliente.messaging;

import br.com.empresa_aerea.ms_cliente.dtos.UsuarioCriadoEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class UsuarioProducer {

    private final RabbitTemplate rabbitTemplate;

    public UsuarioProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void enviarUsuarioCriado(UsuarioCriadoEvent evento) {
        Map<String, Object> mensagem = Map.of(
            "email", evento.getEmail(),
            "senha", evento.getSenha(),
            "tipo", evento.getTipo()
        );

        rabbitTemplate.convertAndSend("saga-exchange", "usuario.criar", mensagem);
    }
}

