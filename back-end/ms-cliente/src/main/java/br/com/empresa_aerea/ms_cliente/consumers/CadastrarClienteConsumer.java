package br.com.empresa_aerea.ms_cliente.consumers;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.com.empresa_aerea.ms_cliente.dtos.ClienteCadastroResponseDTO;
import br.com.empresa_aerea.ms_cliente.dtos.ClienteDTO;
import br.com.empresa_aerea.ms_cliente.services.ClienteService;

@Component
public class CadastrarClienteConsumer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    ClienteService clienteService;

    private static final String EXCHANGE_NAME = "saga-exchange";

    @RabbitListener(queues = "ms-cliente-cadastrar-cliente")
    public void cadastrarCliente(ClienteDTO clienteDto) {
        try {
            ClienteCadastroResponseDTO clienteCadastroResponseDTO = clienteService.cadastrarCliente(clienteDto);
            rabbitTemplate.convertAndSend(EXCHANGE_NAME, "saga-ms-cliente-cadastrar-cliente", clienteCadastroResponseDTO);
        } catch (Exception e) {
            rabbitTemplate.convertAndSend(EXCHANGE_NAME, "saga-ms-cliente-cadastrar-cliente", new ClienteCadastroResponseDTO(null, null,null,null,null,null,e.getMessage()));
        }
    }
    
}