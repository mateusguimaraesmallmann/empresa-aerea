package br.com.empresa_aerea.saga.services;

import br.com.empresa_aerea.saga.configurations.RabbitMQConfiguration;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import br.com.empresa_aerea.saga.events.UserRegisteredEvent;

@Service
public class SagaOrchestratorService {

    private RestTemplate restTemplate;
    private RabbitTemplate rabbitTemplate;
    private String clienteServiceUrl;
    private String authServiceUrl;

    public SagaOrchestratorService(RestTemplate restTemplate, RabbitTemplate rabbitTemplate, 
        @Value("${ms.cliente.url}") String clienteServiceUrl,
        @Value("${ms.auth.url}") String authServiceUrl) {

        this.restTemplate = restTemplate;
        this.rabbitTemplate = rabbitTemplate;
        this.clienteServiceUrl = clienteServiceUrl;
        this.authServiceUrl = authServiceUrl;
    }

    @RabbitListener(queues = RabbitMQConfiguration.USER_REGISTERED_QUEUE)
    public void handleUserRegistered(UserRegisteredEvent event) {
        try {

            restTemplate.postForEntity(
                clienteServiceUrl + "/ms-cliente/clientes", event, Void.class
            );

        } catch (Exception ex) {

            rabbitTemplate.convertAndSend(RabbitMQConfiguration.EXCHANGE, "user.register.compensate", event.getUserId());
        }
    }

    @RabbitListener(queues = RabbitMQConfiguration.USER_COMPENSATE_QUEUE)
    public void handleRegisterCompensation(String userId) {
        restTemplate.delete(authServiceUrl + "/auth/users/" + userId);
    }
    
}