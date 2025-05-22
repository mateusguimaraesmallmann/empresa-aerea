package br.com.empresa_aerea.ms_voos.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

//Representa o bloco da resposta com filtros e lista de voos, conforme os requisitos
@Data
public class BuscarVoosResponseDTO {
    private LocalDate data;
    private String origem;
    private String destino;
    private List<VooDTO> voos; // lista dos voos encontrados
}