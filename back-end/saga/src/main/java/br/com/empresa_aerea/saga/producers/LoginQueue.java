package br.com.empresa_aerea.saga.producers;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import br.com.empresa_aerea.saga.configurations.SagaMessaging;

@Component
@Configuration
public class LoginQueue {

    @Bean
    public Queue queueLogin() {
        return new Queue(SagaMessaging.QUEUE_AUTH_LOGIN);
    }

    @Bean
    public Binding bindingLogin(Queue queueLogin, TopicExchange exchange) {
        return BindingBuilder.bind(queueLogin).to(exchange).with(SagaMessaging.CMD_AUTH_LOGIN);
    }

    @Bean
    public Queue queueClienteLogin() {
        return new Queue(SagaMessaging.QUEUE_AUTH_CLIENTE);
    }

    @Bean
    public Binding bindingClienteLogin(Queue queueClienteLogin, TopicExchange exchange) {
        return BindingBuilder.bind(queueClienteLogin).to(exchange).with(SagaMessaging.CMD_AUTH_CLIENTE);
    }

    @Bean
    public Queue queueFuncionarioLogin() {
        return new Queue(SagaMessaging.QUEUE_AUTH_FUNCIONARIO);
    }

    @Bean
    public Binding bindingFuncionarioLogin(Queue queueFuncionarioLogin, TopicExchange exchange) {
        return BindingBuilder.bind(queueFuncionarioLogin).to(exchange).with(SagaMessaging.CMD_AUTH_FUNCIONARIO);
    }

    @Bean
    public Queue queueRespostaLogin() {
        return new Queue(SagaMessaging.QUEUE_RPL_AUTH_LOGIN);
    }

    @Bean
    public Binding bindingRespostaLogin(Queue queueRespostaLogin, TopicExchange exchange) {
        return BindingBuilder.bind(queueRespostaLogin).to(exchange).with(SagaMessaging.RPL_AUTH_LOGIN);
    }

    @Bean
    public Queue queueRespostaClienteLogin() {
        return new Queue(SagaMessaging.QUEUE_RPL_AUTH_CLIENTE);
    }

    @Bean
    public Binding bindingRespostaClienteLogin(Queue queueRespostaClienteLogin, TopicExchange exchange) {
        return BindingBuilder.bind(queueRespostaClienteLogin).to(exchange).with(SagaMessaging.RPL_AUTH_CLIENTE);
    }

    @Bean
    public Queue queueRespostaFuncionarioLogin() {
        return new Queue(SagaMessaging.QUEUE_RPL_AUTH_FUNCIONARIO);
    }

    @Bean
    public Binding bindingRespostaFuncionarioLogin(Queue queueRespostaFuncionarioLogin, TopicExchange exchange) {
        return BindingBuilder.bind(queueRespostaFuncionarioLogin).to(exchange).with(SagaMessaging.RPL_AUTH_FUNCIONARIO);
    }

}