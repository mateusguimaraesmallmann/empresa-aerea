package br.com.empresa_aerea.saga.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ClienteCadastroRequestDTO {

    private String cpf;
    private String email;
    private String nome;
    private Integer saldo_milhas;
    private EnderecoCadastroRequestDTO endereco;

}