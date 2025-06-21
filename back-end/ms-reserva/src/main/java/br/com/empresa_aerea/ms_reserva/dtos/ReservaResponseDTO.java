package br.com.empresa_aerea.ms_reserva.dtos;

import java.time.LocalDateTime;

import br.com.empresa_aerea.ms_reserva.enums.EstadoReservaEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservaResponseDTO {

    private String codigo;
    private String codigoVoo;
    private String clienteCpf;
    private Integer idCliente;
    private LocalDateTime dataHora;
    private EstadoReservaEnum estado;
    private int quantidadePassagens;
    private int milhasUtilizadas;
    private double valorPagoEmDinheiro;
}

