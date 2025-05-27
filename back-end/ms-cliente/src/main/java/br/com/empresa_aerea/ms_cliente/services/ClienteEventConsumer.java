// package br.com.empresa_aerea.ms_cliente.services;

// import br.com.empresa_aerea.ms_cliente.dtos.ClienteCriadoEvent;
// import br.com.empresa_aerea.ms_cliente.models.Cliente;
// import br.com.empresa_aerea.ms_cliente.models.Endereco;
// import br.com.empresa_aerea.ms_cliente.repositories.ClienteRepository;
// import org.springframework.amqp.rabbit.annotation.RabbitListener;
// import org.springframework.stereotype.Service;

// @Service
// public class ClienteEventConsumer {

//     private final ClienteRepository clienteRepository;

//     public ClienteEventConsumer(ClienteRepository clienteRepository) {
//         this.clienteRepository = clienteRepository;
//     }

//     @RabbitListener(queues = "cliente.criar")
//     public void handleClienteCriado(ClienteCriadoEvent event) {
//         Cliente cliente = new Cliente();
//         cliente.setCpf(event.getCpf());
//         cliente.setNome(event.getNome());
//         cliente.setEmail(event.getEmail());

//         Endereco endereco = new Endereco();
//         endereco.setCep(event.getEndereco().getCep());
//         endereco.setRua(event.getEndereco().getRua());
//         endereco.setNumero(event.getEndereco().getNumero());
//         endereco.setComplemento(event.getEndereco().getComplemento());
//         endereco.setCidade(event.getEndereco().getCidade());
//         endereco.setEstado(event.getEndereco().getEstado());

//         cliente.setEndereco(endereco);
//         clienteRepository.save(cliente);
//     }
// }
