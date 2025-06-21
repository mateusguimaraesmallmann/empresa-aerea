package br.com.empresa_aerea.ms_reserva.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservaDTO {

    private String codigoVoo;
    private String clienteCpf;
    private Integer idCliente;
    private int quantidadePassagens;
    private int milhasUtilizadas;
    private double valorPagoEmDinheiro;
}
