package br.com.empresa_aerea.ms_cliente.dtos;

import lombok.Data;

@Data
public class ClienteCriadoEvent {
    private String cpf;
    private String nome;
    private String email;
    private EnderecoDTO endereco;
}

