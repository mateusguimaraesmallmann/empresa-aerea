package br.com.empresa_area.ms_auth.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import br.com.empresa_area.ms_auth.enums.TipoUsuario;

public record TokenResponseDTO(@JsonProperty("access_token") String token, @JsonProperty("token_type") String tokenType, TipoUsuario tipo, Object usuario) {}