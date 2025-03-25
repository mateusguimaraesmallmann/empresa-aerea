package com.empresaarea.backend.services;

import com.empresaarea.backend.model.Cliente;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ClienteService {
    
    private final List<Cliente> clientes = new ArrayList<>();
    
    public Cliente salvar(Cliente cliente) {
        cliente.setMilhas(0); // Inicia com 0 milhas
        clientes.add(cliente);
        return cliente;
    }
    
    public List<Cliente> listarTodos() {
        return new ArrayList<>(clientes);
    }
    
    public Cliente buscarPorCpf(String cpf) {
        return clientes.stream()
            .filter(c -> c.getCpf().equals(cpf))
            .findFirst()
            .orElse(null);
    }
    
    public Cliente buscarPorEmail(String email) {
        return clientes.stream()
            .filter(c -> c.getEmail().equalsIgnoreCase(email))
            .findFirst()
            .orElse(null);
    }
}