package br.com.empresa_aerea.ms_funcionario.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.empresa_aerea.ms_funcionario.models.Funcionario;

public interface FuncionarioRepository extends JpaRepository<Funcionario, String>{
    
}
