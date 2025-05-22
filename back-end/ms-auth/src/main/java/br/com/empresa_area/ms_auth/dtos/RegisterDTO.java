package br.com.empresa_area.ms_auth.dtos;

import br.com.empresa_area.ms_auth.enums.TipoUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterDTO(
    @NotBlank String email,
    @NotBlank String senha,
    TipoUsuario tipo
) {
    public String getEmail() {
        return email;
    }

    public String getSenha() {
        return senha;
    }

    public TipoUsuario getTipo() {
        return tipo;
    }
}
