package br.com.empresa_aerea.ms_cliente.consumers;

import org.springframework.context.annotation.Bean;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Component
@Configuration
public class LoginClienteQueue {

    @Bean
    public Queue loginUsuarioClienteQueue() {
        return new Queue("ms-cliente-auth");
    }

    @Bean
    public Binding loginClienteBinding(@Qualifier("loginUsuarioClienteQueue") Queue loginClienteQueue, TopicExchange exchange) {
        return BindingBuilder.bind(loginClienteQueue).to(exchange).with("ms-cliente-auth");
    }
    
}