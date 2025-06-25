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
public class FuncionarioQueue {
    
    @Bean(name = "queueCadastrarFuncionario")
    public Queue queueCadastrarFuncionario() {
        return new Queue(SagaMessaging.QUEUE_CADASTRAR_FUNCIONARIO);
    }

    @Bean
    public Binding bindingCadastrarFuncionario(@Qualifier("queueCadastrarFuncionario") Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(SagaMessaging.CMD_CADASTRAR_FUNCIONARIO);
    }

    @Bean(name = "queueCadastrarLoginFuncionario")
    public Queue queueCadastrarLoginFuncionario() {
        return new Queue(SagaMessaging.QUEUE_CADASTRAR_LOGIN);
    }

    @Bean
    public Binding bindingCadastrarLoginFuncionario(@Qualifier("queueCadastrarLoginFuncionario") Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(SagaMessaging.CMD_CADASTRAR_LOGIN);
    }

    @Bean(name = "queueRespostaCadastrarFuncionario")
    public Queue queueRespostaCadastrarFuncionario() {
        return new Queue(SagaMessaging.QUEUE_RPL_CADASTRAR_FUNCIONARIO);
    }

    @Bean
    public Binding bindingRespostaCadastrarFuncionario(@Qualifier("queueRespostaCadastrarFuncionario") Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(SagaMessaging.RPL_CADASTRAR_FUNCIONARIO);
    }

    @Bean(name = "queueRespostaCadastrarLoginFuncionario")
    public Queue queueRespostaCadastrarLoginFuncionario() {
        return new Queue(SagaMessaging.QUEUE_RPL_CADASTRAR_LOGIN);
    }

    @Bean
    public Binding bindingRespostaCadastrarLoginFuncionario(@Qualifier("queueRespostaCadastrarLoginFuncionario") Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(SagaMessaging.RPL_CADASTRAR_LOGIN);
    }

    //========================================================================================== ALTERAR FUNCIONARIO
    @Bean(name = "queueAlterarFuncionario")
    public Queue queueAlterarFuncionario() {
        return new Queue(SagaMessaging.QUEUE_ALTERAR_FUNCIONARIO);
    }

    @Bean
    public Binding bindingAlterarFuncionario(@Qualifier("queueAlterarFuncionario") Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(SagaMessaging.CMD_ALTERAR_FUNCIONARIO);
    }

    @Bean(name = "queueAlterarLogin")
    public Queue queueAlterarLogin() {
        return new Queue(SagaMessaging.QUEUE_ALTERAR_LOGIN);
    }

    @Bean
    public Binding bindingAlterarLogin(@Qualifier("queueAlterarLogin") Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(SagaMessaging.CMD_ALTERAR_LOGIN);
    }

    @Bean(name = "queueConsultarFuncionario")
    public Queue queueConsultarFuncionario() {
        return new Queue(SagaMessaging.QUEUE_CONSULTAR_FUNCIONARIO);
    }

    @Bean
    public Binding bindingConsultarFuncionario(@Qualifier("queueConsultarFuncionario") Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(SagaMessaging.CMD_CONSULTAR_FUNCIONARIO);
    }

}