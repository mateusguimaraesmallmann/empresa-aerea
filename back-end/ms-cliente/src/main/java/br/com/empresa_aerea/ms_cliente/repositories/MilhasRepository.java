package br.com.empresa_aerea.ms_cliente.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.empresa_aerea.ms_cliente.models.Milha;

@Repository
public interface MilhasRepository extends JpaRepository<Milha, Long> {

    Optional<List<Milha>> findByClienteIdCliente(Long idCliente);
   
}
