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
public class CadastrarFuncionarioQueue {

    @Bean
    public Queue cadastroFuncionarioQueue() {
        return new Queue("ms-funcionario-cadastrar-funcionario");
    }

    @Bean
    public Binding bindingCadastrarFuncionario(@Qualifier("cadastroFuncionarioQueue") Queue cadastrarFuncionarioQueue, TopicExchange exchange) {
        return BindingBuilder.bind(cadastrarFuncionarioQueue).to(exchange).with("ms-funcionario-cadastrar-funcionario");
    }

}