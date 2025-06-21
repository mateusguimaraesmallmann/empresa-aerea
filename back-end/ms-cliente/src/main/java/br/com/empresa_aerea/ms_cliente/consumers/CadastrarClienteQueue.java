package br.com.empresa_aerea.ms_cliente.consumers;

import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.Binding;

@Component
@Configuration
public class CadastrarClienteQueue  {

    @Bean
    public Queue clienteUsuarioCadastrarQueue() {
        return new Queue("ms-cliente-cadastrar-cliente");
    }

    @Bean
    public Binding clienteUsuarioCadastrarBinding(
        @Qualifier("clienteUsuarioCadastrarQueue") Queue clienteUsuarioCadastrarQueue, TopicExchange exchange) {
        return BindingBuilder.bind(clienteUsuarioCadastrarQueue).to(exchange).with("ms-cliente-cadastrar-cliente");
    }
    
}