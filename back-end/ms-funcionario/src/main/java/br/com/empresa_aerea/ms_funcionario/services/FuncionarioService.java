package br.com.empresa_aerea.ms_funcionario.services;

import br.com.empresa_aerea.ms_funcionario.dtos.FuncionarioDTO;
import br.com.empresa_aerea.ms_funcionario.models.Funcionario;
import br.com.empresa_aerea.ms_funcionario.repositories.FuncionarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FuncionarioService {

    private final FuncionarioRepository funcionarioRepository;

    public FuncionarioService(FuncionarioRepository funcionarioRepository) {
        this.funcionarioRepository = funcionarioRepository;
    }

    public Funcionario salvar(FuncionarioDTO dto) {
        Funcionario funcionario = new Funcionario(
            dto.getIdFuncionario(), 
            dto.getCpf(), 
            dto.getEmail(), 
            dto.getNome(), 
            dto.getTelefone()
        );
        return funcionarioRepository.save(funcionario);
    }

    public List<Funcionario> listarTodos() {
        return funcionarioRepository.findAll();
    }

    public Optional<Funcionario> buscarPorCpf(String cpf) {
        return funcionarioRepository.findByCpf(cpf);
    }

    public Funcionario atualizar(String cpf, Funcionario dados) {
        return funcionarioRepository.findByCpf(cpf)
            .map(existing -> {
                existing.setNome(dados.getNome());
                existing.setEmail(dados.getEmail());
                existing.setTelefone(dados.getTelefone());
                return funcionarioRepository.save(existing);
            }).orElseThrow(() -> new IllegalArgumentException("Funcionário não encontrado"));
    }

    public void delete(String cpf) {
        funcionarioRepository.findByCpf(cpf).ifPresent(funcionarioRepository::delete);
    }
}
