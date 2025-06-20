package br.com.empresa_area.ms_auth.consumers;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.com.empresa_area.ms_auth.dtos.RegisterRequestDTO;
import br.com.empresa_area.ms_auth.dtos.RegisterResponseDTO;
import br.com.empresa_area.ms_auth.services.AuthorizationService;

@Component
public class CadastrarLoginConsumer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    AuthorizationService authorizationService;

    private static final String EXCHANGE_NAME = "saga-exchange";

    @RabbitListener(queues = "ms-auth-cadastrar-login")
    public void cadastrarCliente(RegisterRequestDTO registerRequestCadastrarDTO) {
        try {
            RegisterResponseDTO registerResponseDTO = authorizationService.cadastrarLogin(registerRequestCadastrarDTO);
            rabbitTemplate.convertAndSend(EXCHANGE_NAME, "saga-ms-auth-cadastrar-login", registerResponseDTO);
        } catch (Exception e) {
            rabbitTemplate.convertAndSend(EXCHANGE_NAME, "saga-ms-auth-cadastrar-login", new RegisterResponseDTO(null, null, e.getMessage()));
        }
    }
    
}