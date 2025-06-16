package br.com.empresa_aerea.ms_cliente.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ClienteResponseCadastrarDTO {

    private Long idCliente;
    private String cpf;
    private String email;
    private String nome;
    private Integer saldo_milhas;
    private EnderecoDTO endereco;
    private String errorMessage;
    
}