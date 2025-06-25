package br.com.empresa_aerea.ms_funcionario.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FuncionarioListDTO {

    private Long codigo;
    private String cpf;
    private String email;
    private String nome;
    private String telefone;
    private String tipo;
    
}
