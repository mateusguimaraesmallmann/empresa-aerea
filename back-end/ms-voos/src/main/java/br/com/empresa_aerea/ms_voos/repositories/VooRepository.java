package br.com.empresa_aerea.ms_voos.repositories;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.empresa_aerea.ms_voos.models.Voo;

public interface VooRepository extends JpaRepository<Voo, String> {

    List<Voo> findByDataHoraAfterOrderByDataHoraAsc(OffsetDateTime from);
    List<Voo> findByOrigemAndDestinoAndDataHoraAfterOrderByDataHoraAsc(String origem, String destino, OffsetDateTime from);
    
}
