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
    public Binding bindingCadastrarCliente(@Qualifier("queueCadastrarCliente") Queue queueCadastrarCliente, TopicExchange exchange) {
        return BindingBuilder.bind(queueCadastrarCliente).to(exchange).with(SagaMessaging.CMD_CADASTRAR_CLIENTE);
    }

    @Bean(name = "queueCadastrarLogin")
    public Queue queueCadastrarLogin() {
        return new Queue(SagaMessaging.QUEUE_CADASTRAR_LOGIN);
    }

    @Bean
    public Binding bindingCadastrarLogin(@Qualifier("queueCadastrarLogin") Queue queueCadastrarLogin, TopicExchange exchange) {
        return BindingBuilder.bind(queueCadastrarLogin).to(exchange).with(SagaMessaging.CMD_CADASTRAR_LOGIN);
    }

    @Bean(name = "queueRespostaCadastrarCliente")
    public Queue queueRespostaCadastrarCliente() {
        return new Queue(SagaMessaging.QUEUE_RPL_CADASTRAR_CLIENTE);
    }

    @Bean
    public Binding bindingRespostaCadastrarCliente(@Qualifier("queueRespostaCadastrarCliente") Queue queueRespostaCadastrarCliente, TopicExchange exchange) {
        return BindingBuilder.bind(queueRespostaCadastrarCliente).to(exchange).with(SagaMessaging.RPL_CADASTRAR_CLIENTE);
    }

    @Bean(name = "queueRespostaCadastrarLogin")
    public Queue queueRespostaCadastrarLogin() {
        return new Queue(SagaMessaging.QUEUE_RPL_CADASTRAR_LOGIN);
    }

    @Bean
    public Binding bindingRespostaCadastrarLogin(@Qualifier("queueRespostaCadastrarLogin") Queue queueRespostaCadastrarLogin, TopicExchange exchange) {
        return BindingBuilder.bind(queueRespostaCadastrarLogin).to(exchange).with(SagaMessaging.RPL_CADASTRAR_LOGIN);
    }
    
}