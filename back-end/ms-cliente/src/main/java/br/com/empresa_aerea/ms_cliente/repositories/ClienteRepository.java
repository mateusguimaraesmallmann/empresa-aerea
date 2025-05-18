package br.com.empresa_aerea.ms_cliente.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.empresa_aerea.ms_cliente.models.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByEmail(String email);
    Optional<Cliente> findByCpf(String cpf);
}
