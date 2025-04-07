package br.com.empresa_aerea.ms_cliente.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.empresa_aerea.ms_cliente.models.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, String>{
    
}
