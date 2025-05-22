package br.com.empresa_aerea.ms_reserva.models;

import br.com.empresa_aerea.ms_reserva.enums.EstadoReservaEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "historico_estado_reserva")
public class HistoricoEstadoReserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codigoReserva;

    private LocalDateTime dataHora;

    @Enumerated(EnumType.STRING)
    private EstadoReservaEnum estadoOrigem;

    @Enumerated(EnumType.STRING)
    private EstadoReservaEnum estadoDestino;
}