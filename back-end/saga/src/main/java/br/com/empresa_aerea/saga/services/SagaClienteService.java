package br.com.empresa_aerea.saga.services;

import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

import org.springframework.amqp.rabbit.core.RabbitTemplate;

import com.rabbitmq.client.ConnectionFactory;

import br.com.empresa_aerea.saga.messaging.SagaMessaging;
import br.com.empresa_aerea.saga.util.DirectMessageListenerContainerBuilder;

public class SagaClienteService {
    /*private static final long TIMEOUT_SECONDS = 30;
    private final RabbitTemplate rabbitTemplate;
    private final ConnectionFactory connectionFactory;

    public SagaClienteService(RabbitTemplate rabbitTemplate,
                              ConnectionFactory connectionFactory) {
        this.rabbitTemplate = rabbitTemplate;
        this.connectionFactory = connectionFactory;
    }

    public Map<String, Object> iniciarCadastro(Map<String, Object> clienteDto) throws Exception {
        CompletableFuture<Map<String, Object>> future = new CompletableFuture<>();
        var container = DirectMessageListenerContainerBuilder.build(
            connectionFactory,
            SagaMessaging.RPL_CADASTRO_CLIENTE,
            future
        );
        container.start();
        try {
            rabbitTemplate.convertAndSend(
                SagaMessaging.EXCHANGE,
                SagaMessaging.CMD_CADASTRAR_CLIENTE,
                clienteDto
            );
            return future.get(TIMEOUT_SECONDS, TimeUnit.SECONDS);
        } finally {
            container.stop();
        }
    }*/
    
}
