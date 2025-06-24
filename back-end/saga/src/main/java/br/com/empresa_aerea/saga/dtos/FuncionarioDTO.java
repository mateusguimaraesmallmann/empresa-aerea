package br.com.empresa_aerea.saga.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FuncionarioDTO {

    private Long idFuncionario;
    private String cpf;
    private String email;
    private String nome;
    private String telefone;
    private boolean ativo;
    
}