package br.com.empresa_area.ms_auth.dtos;

import br.com.empresa_area.ms_auth.enums.TipoUsuario;

public record TokenResponseDTO(String token, String login, TipoUsuario tipo, Object id) {}
