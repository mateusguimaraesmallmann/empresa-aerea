package br.com.empresa_aerea.ms_cliente.repositories;

import br.com.empresa_aerea.ms_cliente.models.Cliente;
import br.com.empresa_aerea.ms_cliente.models.TransacaoMilhas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransacaoMilhasRepository extends JpaRepository<TransacaoMilhas, Long> {
    List<TransacaoMilhas> findByClienteOrderByDataHoraDesc(Cliente cliente);
}
