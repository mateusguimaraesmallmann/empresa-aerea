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
public class AlterarLoginQueue {

    @Bean
    public Queue loginUsuarioAlterarQueue() {
        return new Queue("ms-auth-alterar-login");
    }

    @Bean
    public Binding loginUsuarioAlterarBinding(@Qualifier("loginUsuarioAlterarQueue") Queue alterarLoginQueue, TopicExchange exchange) {
        return BindingBuilder.bind(alterarLoginQueue).to(exchange).with("ms-auth-alterar-login");
    }
    
}
