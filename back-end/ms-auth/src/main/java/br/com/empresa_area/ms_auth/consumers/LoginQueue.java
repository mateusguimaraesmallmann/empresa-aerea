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
public class LoginQueue {

    @Bean
    public Queue loginUsuarioQueue() {
        return new Queue("auth-login");
    }

    @Bean
    public Binding loginBinding(@Qualifier("loginUsuarioQueue") Queue loginQueue, TopicExchange exchange) {
        return BindingBuilder.bind(loginQueue).to(exchange).with("auth-login");
    }
    
}