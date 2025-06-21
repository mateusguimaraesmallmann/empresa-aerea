package br.com.empresa_aerea.ms_reserva.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.empresa_aerea.ms_reserva.models.Reserva;

public interface ReservaRepository extends JpaRepository<Reserva, String> {
    List<Reserva> findByIdCliente(Long idCliente);
}
