package br.com.empresa_aerea.saga.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ClienteCadastroRequestDTO {

    private String cpf;
    private String email;
    private String nome;
    private Integer saldo_milhas;
    private EnderecoCadastroRequestDTO endereco;

}