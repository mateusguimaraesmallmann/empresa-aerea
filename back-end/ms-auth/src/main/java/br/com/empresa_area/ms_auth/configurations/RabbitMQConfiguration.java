package br.com.empresa_area.ms_auth.configurations;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;

@Configuration
public class RabbitMQConfiguration {

    // Nomes das filas de requisição
    public static final String EXCHANGE = "saga-exchange";
    public static final String RPC_QUEUE_CLIENTE = "rpc.cliente.fetch";
    public static final String RPC_QUEUE_FUNCIONARIO = "rpc.funcionario.fetch";

    @Bean TopicExchange sagaExchange() {
        return new TopicExchange(EXCHANGE, true, false);
    }

    @Bean Queue clienteFetchQueue() {
        return new Queue(RPC_QUEUE_CLIENTE, true);
    }

    @Bean Queue funcionarioFetchQueue() {
        return new Queue(RPC_QUEUE_FUNCIONARIO, true);
    }

    @Bean Binding bindClienteFetch(Queue clienteFetchQueue, TopicExchange ex) {
        return BindingBuilder
          .bind(clienteFetchQueue)
          .to(ex)
          .with(RPC_QUEUE_CLIENTE);
    }

    @Bean Binding bindFuncionarioFetch(Queue funcionarioFetchQueue, TopicExchange ex) {
        return BindingBuilder
          .bind(funcionarioFetchQueue)
          .to(ex)
          .with(RPC_QUEUE_FUNCIONARIO);
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory cf, Jackson2JsonMessageConverter conv) {
        RabbitTemplate tpl = new RabbitTemplate(cf);
        tpl.setExchange(EXCHANGE);
        tpl.setMessageConverter(conv);
        tpl.setReplyTimeout(5_000);
        return tpl;
    }

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
    
}