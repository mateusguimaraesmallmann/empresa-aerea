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
public class ConsultarFuncionarioQueue {

    @Bean
    public Queue consultaFuncionarioQueue() {
        return new Queue("ms-funcionario-consultar-funcionario");
    }

    @Bean
    public Binding bindingCadastrarFuncionario(@Qualifier("consultaFuncionarioQueue") Queue consultarFuncionarioQueue, TopicExchange exchange) {
        return BindingBuilder.bind(consultarFuncionarioQueue).to(exchange).with("ms-funcionario-consultar-funcionario");
    }
    
}