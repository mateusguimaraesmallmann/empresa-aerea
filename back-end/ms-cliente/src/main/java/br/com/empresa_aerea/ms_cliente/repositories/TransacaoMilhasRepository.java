package br.com.empresa_aerea.ms_cliente.repositories;

import br.com.empresa_aerea.ms_cliente.models.TransacaoMilhas;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.empresa_aerea.ms_cliente.models.Cliente;

@Repository
public interface TransacaoMilhasRepository extends JpaRepository<TransacaoMilhas, Long>{

    List<TransacaoMilhas> findByClienteOrderByDataHoraDesc(Cliente cliente);
    
}