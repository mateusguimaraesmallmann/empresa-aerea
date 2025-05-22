package br.com.empresa_aerea.ms_reserva.repositories;

import br.com.empresa_aerea.ms_reserva.models.HistoricoEstadoReserva;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistoricoEstadoReservaRepository extends JpaRepository<HistoricoEstadoReserva, Long> {
    
}
