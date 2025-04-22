package br.com.empresa_aerea.ms_reserva.services;

import java.util.UUID;

import org.springframework.stereotype.Service;

import br.com.empresa_aerea.ms_reserva.dtos.ReservaDTO;
import br.com.empresa_aerea.ms_reserva.enums.EstadoReservaEnum;
import br.com.empresa_aerea.ms_reserva.models.Reserva;
import br.com.empresa_aerea.ms_reserva.repositories.ReservaRepository;
import jakarta.transaction.Transactional;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;

    public ReservaService(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }

    @Transactional
    public Reserva criar(ReservaDTO dto) {
        String codigo = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Reserva reserva = new Reserva(codigo, dto.getCodigoVoo(), dto.getClienteCpf(), null, EstadoReservaEnum.CRIADA);
        reserva = reservaRepository.save(reserva);
        return reserva;
    }

    public Reserva buscar(String codigo) {
        return reservaRepository.findById(codigo)
                .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada"));
    }

    @Transactional
    public Reserva atualizarEstado(String codigo) {
        Reserva reserva = buscar(codigo);
        EstadoReservaEnum origem = reserva.getEstado();
        EstadoReservaEnum destino = EstadoReservaEnum.CHECK_IN;
        reserva.setEstado(destino);
        reservaRepository.save(reserva);
        return reserva;
    }

    @Transactional
    public void cancelar(String codigo) {
        Reserva reserva = buscar(codigo);
        if (reserva.getEstado() == EstadoReservaEnum.CRIADA || reserva.getEstado() == EstadoReservaEnum.CHECK_IN) {
            EstadoReservaEnum origem = reserva.getEstado();
            reserva.setEstado(EstadoReservaEnum.CANCELADA);
            reservaRepository.save(reserva);
        } else {
            throw new IllegalStateException("Não é possível cancelar esta reserva no estado " + reserva.getEstado());
        }
    }
    
}
