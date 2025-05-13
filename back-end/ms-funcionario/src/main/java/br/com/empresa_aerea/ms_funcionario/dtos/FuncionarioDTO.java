package br.com.empresa_aerea.ms_funcionario.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FuncionarioDTO {
    private String cpf;
    private String email;
    private String nome;
    private String senha;
    private String dataNascimento;
    private String telefone;
}
