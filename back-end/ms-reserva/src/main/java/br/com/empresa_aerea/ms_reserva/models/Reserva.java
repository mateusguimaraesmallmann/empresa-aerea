package br.com.empresa_aerea.ms_reserva.models;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import br.com.empresa_aerea.ms_reserva.enums.EstadoReservaEnum;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reservas")
public class Reserva {

    private String codigo;
    private String codigoVoo;
    private String clienteCpf;
    @CreationTimestamp
    private LocalDateTime dataHora;
    private EstadoReservaEnum estado;
    
}
