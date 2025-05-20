package br.com.empresa_aerea.ms_funcionario.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FuncionarioDTO {
    private Long idFuncionario;
    private String cpf;
    private String email;
    private String nome;
    private String telefone;
}