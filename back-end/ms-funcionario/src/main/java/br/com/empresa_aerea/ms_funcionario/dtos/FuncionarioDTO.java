package br.com.empresa_aerea.ms_funcionario.dtos;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FuncionarioDTO {
    
    private Long idFuncionario;

    // Remova as anotações de validação do CPF
    private String cpf;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String nome;

    @NotBlank
    @Pattern(regexp = "\\d{10,11}", message = "Telefone inválido")
    private String telefone;

    private boolean ativo;

}