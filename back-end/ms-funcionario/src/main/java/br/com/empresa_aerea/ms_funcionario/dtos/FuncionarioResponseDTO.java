package br.com.empresa_aerea.ms_funcionario.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FuncionarioResponseDTO {
    
    private Long idFuncionario;
    private String cpf;
    private String nome;
    private String email;
    private String telefone;
    private boolean ativo;
    private String errorMessage;

}