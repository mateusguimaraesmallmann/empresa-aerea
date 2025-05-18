package br.com.empresa_aerea.ms_cliente.services;

import org.modelmapper.ModelMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.empresa_aerea.ms_cliente.dtos.ClienteDTO;
import br.com.empresa_aerea.ms_cliente.dtos.UserFetchRequestDTO;
import br.com.empresa_aerea.ms_cliente.repositories.ClienteRepository;
import jakarta.persistence.EntityNotFoundException;

@Service
public class ClienteFetchHandlerService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ModelMapper mapper;

    @RabbitListener(queues = "rpc.cliente.fetch")
    public ClienteDTO handleFetch(UserFetchRequestDTO req) {
        // Converte o userId (String) para Long
        Long id;
        try {
            id = Long.parseLong(req.userId());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("ID do cliente inválido: " + req.userId(), e);
        }

        var entity = clienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado"));

        return mapper.map(entity, ClienteDTO.class);
    }

}