package br.com.empresa_aerea.ms_funcionario.services;

import br.com.empresa_aerea.ms_funcionario.models.Funcionario;
import br.com.empresa_aerea.ms_funcionario.repositories.FuncionarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FuncionarioService {
    
    @Autowired
    private FuncionarioRepository repository;

    public Funcionario salvar(Funcionario funcionario) {
        return repository.save(funcionario);
    }
    
    public List<Funcionario> listarTodos() {
        return repository.findAll();
    }

    public Optional<Funcionario> buscarPorCpf(String cpf) {
        return repository.findByCpf(cpf);
    }

    public Funcionario atualizar(String cpf, Funcionario dados) {
        return repository.findByCpf(cpf)
            .map(existing -> {
                existing.setNome(dados.getNome());
                existing.setEmail(dados.getEmail());
                existing.setTelefone(dados.getTelefone());
                return repository.save(existing);
            }).orElseThrow(() -> new IllegalArgumentException("Funcionário não encontrado"));
    }
    
    public void delete(String cpf) {
        repository.findByCpf(cpf).ifPresent(func -> {
            repository.delete(func);
        });
    }

}