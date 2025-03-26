package com.empresaarea.backend.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Funcionario {
    private String email;
    private String nome;
    private String senha;
    private String dataNasc;
}