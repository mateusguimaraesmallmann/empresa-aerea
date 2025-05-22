package br.com.empresa_area.ms_auth.dtos;

import br.com.empresa_area.ms_auth.enums.TipoUsuario;

public record UserDTO(
        String codigo,
        String email,
        TipoUsuario tipo
) {}
