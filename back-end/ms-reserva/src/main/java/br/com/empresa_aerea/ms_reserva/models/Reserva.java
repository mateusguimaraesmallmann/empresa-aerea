package br.com.empresa_aerea.ms_reserva.models;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.CreationTimestamp;

import br.com.empresa_aerea.ms_reserva.enums.EstadoReservaEnum;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reservas")
public class Reserva {

    @Id
    @Column(length = 8, nullable = false, unique = true)
    private String codigo;
    private String codigoVoo;
    private String clienteCpf;

    @Column(name = "id_cliente")
    private Integer idCliente;

    @CreationTimestamp
    private LocalDateTime dataHora;
    private EstadoReservaEnum estado;
    private int quantidadePassagens;
    private int milhasUtilizadas;
    private double valorPagoEmDinheiro;
}
