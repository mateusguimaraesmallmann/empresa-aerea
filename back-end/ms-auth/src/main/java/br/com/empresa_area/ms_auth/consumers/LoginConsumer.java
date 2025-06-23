package br.com.empresa_area.ms_auth.consumers;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.com.empresa_area.ms_auth.dtos.AuthResponseDTO;
import br.com.empresa_area.ms_auth.dtos.LoginRequestDTO;
import br.com.empresa_area.ms_auth.services.AuthorizationService;

@Component
public class LoginConsumer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private AuthorizationService service;

    private static final String EXCHANGE_NAME = "saga-exchange";

    @RabbitListener(queues = "auth-login")
    public void login(LoginRequestDTO loginRequestDTO) {
        try {
            AuthResponseDTO authResponseDTO = service.login(loginRequestDTO);
            rabbitTemplate.convertAndSend(EXCHANGE_NAME, "saga-auth-login", authResponseDTO);
        } catch (Exception e) {
            rabbitTemplate.convertAndSend(EXCHANGE_NAME, "saga-auth-login", new AuthResponseDTO(null, null, e.getMessage()));
        }
    }
    
}