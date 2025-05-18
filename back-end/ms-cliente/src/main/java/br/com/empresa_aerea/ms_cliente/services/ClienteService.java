package br.com.empresa_aerea.ms_cliente.services;

import br.com.empresa_aerea.ms_cliente.models.Cliente;
import br.com.empresa_aerea.ms_cliente.repositories.ClienteRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {
    
    @Autowired
    private ClienteRepository repository;
    
    public Cliente salvar(Cliente cliente) {
        cliente.setMilhas(0);
        return repository.save(cliente);
    }
    
    public List<Cliente> listarTodos() {
        return repository.findAll();
    }

    public Optional<Cliente> buscarPorCpf(String cpf) {
        return repository.findByCpf(cpf);
    }

    public Optional<Cliente> buscarPorEmail(String email) {
        return repository.findByEmail(email);
    }

}