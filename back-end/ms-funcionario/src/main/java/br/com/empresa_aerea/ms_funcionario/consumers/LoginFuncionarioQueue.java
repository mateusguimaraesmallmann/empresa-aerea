package br.com.empresa_aerea.ms_funcionario.consumers;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Component
@Configuration
public class LoginFuncionarioQueue {

    @Bean
    public Queue loginUsuarioFuncionarioQueue() {
        return new Queue("ms-funcionario-auth");
    }

    @Bean
    public Binding loginFuncionarioBinding(@Qualifier("loginUsuarioFuncionarioQueue") Queue loginFuncionarioQueue, TopicExchange exchange) {
        return BindingBuilder.bind(loginFuncionarioQueue).to(exchange).with("ms-funcionario-auth");
    }
    
}