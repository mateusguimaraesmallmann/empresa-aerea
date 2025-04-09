package br.com.empresa_aerea.ms_voos.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Voo {
    private String dataHora;
    private String origem;
    private String destino;
    private String status;
}
