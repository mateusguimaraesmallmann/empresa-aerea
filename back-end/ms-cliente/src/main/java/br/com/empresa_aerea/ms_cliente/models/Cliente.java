package br.com.empresa_aerea.ms_cliente.models;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {
    private String cpf;
    private String nome;
    private String email;
    private String cep;
    private String ruaNumero;
    private String complemento;
    private String cidade;
    private String uf;
    private int milhas;
}