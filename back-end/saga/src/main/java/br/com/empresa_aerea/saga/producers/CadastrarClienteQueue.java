package br.com.empresa_aerea.saga.producers;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import br.com.empresa_aerea.saga.configurations.SagaMessaging;

@Component
@Configuration
public class CadastrarClienteQueue {

    @Bean(name = "queueCadastrarCliente")
    public Queue queueCadastrarCliente() {
        return new Queue(SagaMessaging.QUEUE_CADASTRAR_CLIENTE);
    }

    @Bean
    public Binding bindingCadastrarCliente(@Qualifier("queueCadastrarCliente") Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(SagaMessaging.CMD_CADASTRAR_CLIENTE);
    }

    @Bean(name = "queueCadastrarLoginCliente")
    public Queue queueCadastrarLoginCliente() {
        return new Queue(SagaMessaging.QUEUE_CADASTRAR_LOGIN);
    }

    @Bean
    public Binding bindingCadastrarLoginCliente(@Qualifier("queueCadastrarLoginCliente") Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(SagaMessaging.CMD_CADASTRAR_LOGIN);
    }

    @Bean(name = "queueRespostaCadastrarCliente")
    public Queue queueRespostaCadastrarCliente() {
        return new Queue(SagaMessaging.QUEUE_RPL_CADASTRAR_CLIENTE);
    }

    @Bean
    public Binding bindingRespostaCadastrarCliente(@Qualifier("queueRespostaCadastrarCliente") Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(SagaMessaging.RPL_CADASTRAR_CLIENTE);
    }

    @Bean(name = "queueRespostaCadastrarLoginCliente")
    public Queue queueRespostaCadastrarLoginCliente() {
        return new Queue(SagaMessaging.QUEUE_RPL_CADASTRAR_LOGIN);
    }

    @Bean
    public Binding bindingRespostaCadastrarLoginCliente(@Qualifier("queueRespostaCadastrarLoginCliente") Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(SagaMessaging.RPL_CADASTRAR_LOGIN);
    }
    
}