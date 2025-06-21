package br.com.empresa_aerea.ms_reserva.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import br.com.empresa_aerea.ms_reserva.dtos.ReservaDTO;
import br.com.empresa_aerea.ms_reserva.enums.EstadoReservaEnum;
import br.com.empresa_aerea.ms_reserva.models.HistoricoEstadoReserva;
import br.com.empresa_aerea.ms_reserva.models.Reserva;
import br.com.empresa_aerea.ms_reserva.repositories.HistoricoEstadoReservaRepository;
import br.com.empresa_aerea.ms_reserva.repositories.ReservaRepository;
import jakarta.transaction.Transactional;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final HistoricoEstadoReservaRepository historicoRepository;

    public ReservaService(ReservaRepository reservaRepository, HistoricoEstadoReservaRepository historicoRepository) {
        this.reservaRepository = reservaRepository;
        this.historicoRepository = historicoRepository;
    }

    @Transactional
    public Reserva criar(ReservaDTO dto) {
        String codigo = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Reserva reserva = new Reserva(
            codigo,
            dto.getCodigoVoo(),
            dto.getClienteCpf(),
            dto.getIdCliente(),
            null,
            EstadoReservaEnum.CRIADA,
            dto.getQuantidadePassagens(),
            dto.getMilhasUtilizadas(),
            dto.getValorPagoEmDinheiro()
        );
        reserva = reservaRepository.save(reserva);
        return reserva;
    }

    public Reserva buscar(String codigo) {
        return reservaRepository.findById(codigo)
                .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada"));
    }

    @Transactional
    public Reserva atualizarEstado(String codigo, EstadoReservaEnum destino) {
        Reserva reserva = buscar(codigo);
        EstadoReservaEnum origem = reserva.getEstado();
        // Só permite mudar para CHECK_IN se o estado atual for CRIADA
        if (destino == EstadoReservaEnum.CHECK_IN && origem != EstadoReservaEnum.CRIADA) {
            throw new IllegalStateException("Check-in só pode ser feito se a reserva está CRIADA.");
        }
        reserva.setEstado(destino);
        reserva = reservaRepository.save(reserva);
        historicoRepository.save(new HistoricoEstadoReserva(null, codigo, LocalDateTime.now(), origem, destino));
        return reserva;
    }

    @Transactional
    public void cancelar(String codigo) {
        Reserva reserva = buscar(codigo);
        if (reserva.getEstado() == EstadoReservaEnum.CRIADA || reserva.getEstado() == EstadoReservaEnum.CHECK_IN) {
            reserva.setEstado(EstadoReservaEnum.CANCELADA);
            reservaRepository.save(reserva);
        } else {
            throw new IllegalStateException("Não é possível cancelar esta reserva no estado " + reserva.getEstado());
        }
    }

    public List<Reserva> listarPorCliente(Long idCliente) {
        return reservaRepository.findByIdCliente(idCliente);
    }
}


