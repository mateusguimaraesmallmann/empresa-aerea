package br.com.empresa_aerea.ms_voos.dto;

import br.com.empresa_aerea.ms_voos.enums.EstadoVooEnum;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CriarVooDTO {
    private String id;
    private String codigo;
    private LocalDateTime dataHora;
    private String origemCodigo;
    private String destinoCodigo;
    private double preco;
    private int poltronas;
    private int poltronasOcupadas;
    private EstadoVooEnum estado;
}