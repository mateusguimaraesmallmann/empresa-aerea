package br.com.empresa_aerea.ms_funcionario.services;

import br.com.empresa_aerea.ms_funcionario.models.Funcionario;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FuncionarioService {
    
    private final List<Funcionario> funcionarios = new ArrayList<>();
    
    public Funcionario salvar(Funcionario funcionario) {
        funcionarios.add(funcionario);
        return funcionario;
    }
    
    public List<Funcionario> listarTodos() {
        return new ArrayList<>(funcionarios);
    }
    
    public Funcionario buscarPorEmail(String email) {
        return funcionarios.stream()
            .filter(f -> f.getEmail().equalsIgnoreCase(email))
            .findFirst()
            .orElse(null);
    }
}