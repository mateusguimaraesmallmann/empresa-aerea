package br.com.empresa_area.ms_auth.consumers;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Component
@Configuration
public class CadastrarLoginQueue {

    @Bean
    public Queue loginUsuarioCadastrarQueue() {
        return new Queue("ms-auth-cadastrar-login");
    }

    @Bean
    public Binding loginUsuarioCadastrarBinding(@Qualifier("loginUsuarioCadastrarQueue") Queue cadastrarLoginQueue, TopicExchange exchange) {
        return BindingBuilder.bind(cadastrarLoginQueue).to(exchange).with("ms-auth-cadastrar-login");
    }
    
}