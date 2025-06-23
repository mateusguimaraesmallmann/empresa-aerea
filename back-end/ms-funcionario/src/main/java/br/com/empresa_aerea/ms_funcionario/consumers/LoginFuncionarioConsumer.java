package br.com.empresa_aerea.ms_funcionario.consumers;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;

import br.com.empresa_aerea.ms_funcionario.dtos.FuncionarioDTO;
import br.com.empresa_aerea.ms_funcionario.dtos.FuncionarioResponseDTO;
import br.com.empresa_aerea.ms_funcionario.services.FuncionarioService;

public class LoginFuncionarioConsumer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private FuncionarioService service;

    private static final String EXCHANGE_NAME = "saga-exchange";

    @RabbitListener(queues = "ms-funcionario-auth")
    public void cadastrarCliente(FuncionarioDTO funcionarioDTO) {
        try {
            FuncionarioResponseDTO funcionarioResponseDTO = service.loginFuncionario(funcionarioDTO);
            rabbitTemplate.convertAndSend(EXCHANGE_NAME, "saga-ms-funcionario-auth", funcionarioResponseDTO);
        } catch (Exception ex) {
            rabbitTemplate.convertAndSend(EXCHANGE_NAME,  "saga-ms-funcionario-auth", new FuncionarioResponseDTO(null, null, null, null, null, false, ex.getMessage()));
        }
    }

}