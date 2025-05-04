package br.com.empresa_aerea.ms_voos.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.empresa_aerea.ms_voos.models.Aeroporto;

public interface AeroportoRepository extends JpaRepository<Aeroporto, String> {
    
}
