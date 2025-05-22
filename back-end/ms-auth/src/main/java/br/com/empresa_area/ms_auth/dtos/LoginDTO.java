package br.com.empresa_area.ms_auth.dtos;

import jakarta.validation.constraints.NotBlank;

public record LoginDTO(
    @NotBlank String login,
    @NotBlank String senha
) {
    public String getLogin() {
        return login;
    }

    public String getSenha() {
        return senha;
    }
}
