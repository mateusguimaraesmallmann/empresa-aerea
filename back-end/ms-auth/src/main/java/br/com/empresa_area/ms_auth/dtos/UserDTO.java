package br.com.empresa_area.ms_auth.dtos;

import br.com.empresa_area.ms_auth.enums.TipoUsuario;

public record UserDTO(String id, String login, TipoUsuario tipo) {}
