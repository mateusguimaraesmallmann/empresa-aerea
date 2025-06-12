package br.com.empresa_area.ms_auth.consumers;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.com.empresa_area.ms_auth.dtos.RegisterDTO;
import br.com.empresa_area.ms_auth.models.Usuario;
import br.com.empresa_area.ms_auth.services.AuthorizationService;

@Component
public class CadastrarLoginConsumer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    AuthorizationService authorizationService;

    private static final String EXCHANGE_NAME = "saga-exchange";

    @RabbitListener(queues = "ms-auth-cadastrar-login")
    public void cadastrarCliente(RegisterDTO registerDTO) {
        try {
            Usuario usuarioRequestCadastrarDto = authorizationService.cadastrarLogin(registerDTO);
            rabbitTemplate.convertAndSend(EXCHANGE_NAME, "saga-ms-auth-cadastrar-login", usuarioRequestCadastrarDto);
        } catch (Exception e) {
            rabbitTemplate.convertAndSend(EXCHANGE_NAME, "saga-ms-auth-cadastrar-login-erro", e.getMessage());
        }
    }
    
}