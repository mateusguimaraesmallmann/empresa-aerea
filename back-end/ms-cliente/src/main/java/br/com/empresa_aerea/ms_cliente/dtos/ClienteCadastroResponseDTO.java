package br.com.empresa_aerea.ms_cliente.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ClienteCadastroResponseDTO {

    private Long idCliente;
    private String cpf;
    private String email;
    private String nome;
    private Integer saldoMilhas;
    private EnderecoDTO endereco;
    private String errorMessage;

}