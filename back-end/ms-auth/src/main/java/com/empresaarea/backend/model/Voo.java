package com.empresaarea.backend.model;

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
