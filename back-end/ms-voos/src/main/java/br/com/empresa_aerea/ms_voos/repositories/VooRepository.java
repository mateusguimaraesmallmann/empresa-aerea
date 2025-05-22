package br.com.empresa_aerea.ms_voos.repositories;

import br.com.empresa_aerea.ms_voos.models.Aeroporto;
import br.com.empresa_aerea.ms_voos.models.Voo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface VooRepository extends JpaRepository<Voo, String> {

    // Consulta todos os voos futuros
    List<Voo> findByDataHoraAfterOrderByDataHoraAsc(LocalDateTime dataHora);

    // Consulta voos futuros com origem e destino específicos
    List<Voo> findByOrigemAndDestinoAndDataHoraAfterOrderByDataHoraAsc(
            Aeroporto origem,
            Aeroporto destino,
            LocalDateTime dataHora
    );
}