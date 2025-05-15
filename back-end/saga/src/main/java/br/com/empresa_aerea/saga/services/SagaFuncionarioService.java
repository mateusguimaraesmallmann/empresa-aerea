package br.com.empresa_aerea.saga.services;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

import org.springframework.amqp.rabbit.core.RabbitTemplate;

import br.com.empresa_aerea.saga.messaging.SagaMessaging;
import br.com.empresa_aerea.saga.util.DirectMessageListenerContainerBuilder;

public class SagaFuncionarioService {
        private static final long TIMEOUT_SECONDS = 30;
    private final RabbitTemplate rabbitTemplate;
    private final ConnectionFactory connectionFactory;

    public SagaFuncionarioService(RabbitTemplate rabbitTemplate,
                                  ConnectionFactory connectionFactory) {
        this.rabbitTemplate = rabbitTemplate;
        this.connectionFactory = connectionFactory;
    }

    public Map<String, Object> iniciarCadastro(Map<String, Object> funcionarioDto) throws Exception {
        CompletableFuture<Map<String, Object>> future = new CompletableFuture<>();
        var container = DirectMessageListenerContainerBuilder.build(
            connectionFactory,
            SagaMessaging.RPL_CADASTRO_FUNCIONARIO,
            future
        );
        container.start();
        try {
            rabbitTemplate.convertAndSend(
                SagaMessaging.EXCHANGE,
                SagaMessaging.CMD_CADASTRAR_FUNCIONARIO,
                funcionarioDto
            );
            return future.get(TIMEOUT_SECONDS, TimeUnit.SECONDS);
        } finally {
            container.stop();
        }
    }
    
}
