package br.com.empresa_aerea.saga.configurations;

import br.com.empresa_aerea.saga.messaging.SagaMessaging;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfiguration {

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(SagaMessaging.EXCHANGE, true, false);
    }

    @Bean
    public RabbitAdmin rabbitAdmin(ConnectionFactory connectionFactory) {
        RabbitAdmin admin = new RabbitAdmin(connectionFactory);
        admin.setAutoStartup(true);
        return admin;
    }

    @Bean
    public ApplicationListener<ApplicationReadyEvent> applicationReadyEventApplicationListener(RabbitAdmin rabbitAdmin) {
        return event -> {
            try {
                rabbitAdmin.initialize();
            } catch (Exception e) {
                System.err.println("Erro ao inicializar RabbitAdmin: " + e.getMessage());
            }
        };
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        rabbitTemplate.setExchange(SagaMessaging.EXCHANGE);
        return rabbitTemplate;
    }

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    // Queues e bindings

    @Bean
    public Queue clienteCriarQueue() {
        return new Queue("cliente.criar", true);
    }

    @Bean
    public Queue usuarioCriarQueue() {
        return new Queue("usuario.criar", true);
    }

    @Bean
    public Queue msClienteCadastrarQueue() {
        return new Queue(SagaMessaging.CMD_CADASTRAR_CLIENTE, true);
    }

    @Bean
    public Queue respostaCadastroClienteQueue() {
        return new Queue(SagaMessaging.RPL_CADASTRO_CLIENTE, true);
    }

    @Bean
    public Binding bindingClienteCriar(Queue clienteCriarQueue, TopicExchange exchange) {
        return BindingBuilder.bind(clienteCriarQueue).to(exchange).with("cliente.criar");
    }

    @Bean
    public Binding bindingUsuarioCriar(Queue usuarioCriarQueue, TopicExchange exchange) {
        return BindingBuilder.bind(usuarioCriarQueue).to(exchange).with("usuario.criar");
    }

    @Bean
    public Binding bindingMsClienteCadastrar(Queue msClienteCadastrarQueue, TopicExchange exchange) {
        return BindingBuilder.bind(msClienteCadastrarQueue).to(exchange).with(SagaMessaging.CMD_CADASTRAR_CLIENTE);
    }

    @Bean
    public Binding bindingRespostaCadastroCliente(Queue respostaCadastroClienteQueue, TopicExchange exchange) {
        return BindingBuilder.bind(respostaCadastroClienteQueue).to(exchange).with(SagaMessaging.RPL_CADASTRO_CLIENTE);
    }
} 
