package br.com.empresa_area.ms_auth.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RegisterDTO(
    @NotBlank(message = "CPF é obrigatório") 
    String cpf,

    @NotBlank(message = "Nome é obrigatório") 
    String nome,

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido") 
    String email,

    @NotBlank(message = "CEP é obrigatório")
    @Pattern(regexp = "\\d{8}", message = "CEP deve ter 8 dígitos") 
    String cep
) {}