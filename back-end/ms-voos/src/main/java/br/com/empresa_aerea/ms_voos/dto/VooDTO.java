package br.com.empresa_aerea.ms_voos.dto;

import br.com.empresa_aerea.ms_voos.enums.EstadoVooEnum;
import br.com.empresa_aerea.ms_voos.models.Aeroporto;
import lombok.Data;
import java.time.LocalDateTime;

//envia a resposta JSON de um voo para o frontend, conforme os requisitos
@Data
public class VooDTO {
    private String codigo;
    private LocalDateTime data;
    private double valor_passagem;
    private int quantidade_poltronas_total;
    private int quantidade_poltronas_ocupadas;
    private EstadoVooEnum estado;
    private Aeroporto aeroporto_origem;
    private Aeroporto aeroporto_destino;
}