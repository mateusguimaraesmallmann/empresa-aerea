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
public class AlterarFuncionarioQueue {

    @Bean
    public Queue alteraFuncionarioQueue() {
        return new Queue("ms-funcionario-alterar-funcionario");
    }

    @Bean
    public Binding bindingCadastrarFuncionario(@Qualifier("alteraFuncionarioQueue") Queue alterarFuncionarioQueue, TopicExchange exchange) {
        return BindingBuilder.bind(alterarFuncionarioQueue).to(exchange).with("ms-funcionario-alterar-funcionario");
    }
    
}