package br.com.empresa_aerea.ms_cliente.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClienteCriadoEvent {
    private String email;
    private String senha;
    private String tipo;
    private String cpf;
    private String nome;
    private EnderecoDTO endereco;
}

