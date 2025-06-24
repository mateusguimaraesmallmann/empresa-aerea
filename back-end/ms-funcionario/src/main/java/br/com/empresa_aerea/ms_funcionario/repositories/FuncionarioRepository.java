package br.com.empresa_aerea.ms_funcionario.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.empresa_aerea.ms_funcionario.models.Funcionario;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {

    Optional<Funcionario> findByCpf(String cpf);
    Optional<Funcionario> findByEmail(String email);
    boolean existsByCpf(String cpf);
    boolean existsByEmail(String email);

}
