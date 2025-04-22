package br.com.empresa_aerea.saga.configurations;

import org.springframework.amqp.core.Queue;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.ExchangeBuilder;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfiguration {

    public static final String EXCHANGE = "saga.exchange";
    public static final String USER_REGISTERED_QUEUE = "saga.user.registered";
    public static final String USER_COMPENSATE_QUEUE = "saga.user.compensate";

    @Bean
    public org.springframework.amqp.core.Exchange sagaExchange() {
        return ExchangeBuilder.directExchange(EXCHANGE).durable(true).build();
    }

    @Bean
    public Queue userRegisteredQueue() {
        return QueueBuilder.durable(USER_REGISTERED_QUEUE).build();
    }

    @Bean
    public Queue userCompensateQueue() {
        return QueueBuilder.durable(USER_COMPENSATE_QUEUE).build();
    }

    @Bean
    public Binding bindingUserRegistered() {
        return BindingBuilder.bind(userRegisteredQueue())
                .to(sagaExchange())
                .with("user.registered")
                .noargs();
    }

    @Bean
    public Binding bindingUserCompensate() {
        return BindingBuilder.bind(userCompensateQueue())
                .to(sagaExchange())
                .with("user.register.compensate")
                .noargs();
    }
    
}
