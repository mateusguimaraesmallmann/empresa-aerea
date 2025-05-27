package br.com.empresa_aerea.ms_cliente.services;

import br.com.empresa_aerea.ms_cliente.models.Cliente;
import br.com.empresa_aerea.ms_cliente.models.Endereco;
import br.com.empresa_aerea.ms_cliente.messaging.SagaMessaging;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Random;

@Component
public class SagaClienteConsumer {

    private final ClienteService clienteService;
    private final RabbitTemplate rabbitTemplate;

    public SagaClienteConsumer(ClienteService clienteService, RabbitTemplate rabbitTemplate) {
        this.clienteService = clienteService;
        this.rabbitTemplate = rabbitTemplate;
    }

    @RabbitListener(queues = SagaMessaging.CMD_CADASTRAR_CLIENTE)
    public void receberCadastroCliente(Map<String, Object> dados) {
        try {
            Map<String, Object> enderecoMap = (Map<String, Object>) dados.get("endereco");

            Cliente cliente = new Cliente();
            cliente.setCpf((String) dados.get("cpf"));
            cliente.setNome((String) dados.get("nome"));
            cliente.setEmail((String) dados.get("email"));

            Endereco endereco = new Endereco();
            endereco.setCep((String) enderecoMap.get("cep"));
            endereco.setRua((String) enderecoMap.get("rua"));
            endereco.setNumero((String) enderecoMap.get("numero"));
            endereco.setComplemento((String) enderecoMap.get("complemento"));
            endereco.setCidade((String) enderecoMap.get("cidade"));
            endereco.setEstado((String) enderecoMap.get("estado"));
            endereco.setBairro("Padrão");

            cliente.setEndereco(endereco);

            String senhaGerada = gerarSenha(4);
            cliente.setSenha(senhaGerada);

            clienteService.salvar(cliente);

            rabbitTemplate.convertAndSend(
                SagaMessaging.EXCHANGE,
                SagaMessaging.RPL_CADASTRO_CLIENTE,
                Map.of("senha", senhaGerada)
            );

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String gerarSenha(int tamanho) {
        String caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder senha = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < tamanho; i++) {
            senha.append(caracteres.charAt(random.nextInt(caracteres.length())));
        }
        return senha.toString();
    }
}
