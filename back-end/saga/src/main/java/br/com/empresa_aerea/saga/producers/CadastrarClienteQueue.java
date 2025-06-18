package br.com.empresa_aerea.saga.producers;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Component
@Configuration
public class CadastrarClienteQueue {

    @Bean
    public Queue cadastrarClienteQueue() {
        return new Queue("ms-cliente-cadastrar-cliente");
    }

    @Bean
    public Binding clienteUsuarioCadastradoBinding(Queue cadastrarClienteQueue, TopicExchange exchange) {
        return BindingBuilder.bind(cadastrarClienteQueue).to(exchange).with("ms-cliente-cadastrar-cliente");
    }

    @Bean
    public Queue cadastrarLoginQueue() {
        return new Queue("ms-auth-cadastrar-login");
    }

    @Bean
    public Binding loginUsuarioCadastradoBinding(Queue cadastrarLoginQueue, TopicExchange exchange) {
        return BindingBuilder.bind(cadastrarLoginQueue).to(exchange).with("ms-auth-cadastrar-login");
    }
    
}