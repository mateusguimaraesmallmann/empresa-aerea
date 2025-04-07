package br.com.empresa_aerea.ms_voos.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.empresa_aerea.ms_voos.models.Voo;

public interface VooRepository extends JpaRepository<Voo, String>{
    
}
