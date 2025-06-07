package br.com.empresa_area.ms_auth.dtos;

import lombok.Data;
@Data
public class UsuarioCriadoEvent {
    private String email;
    private String senha;
    private String tipo;
}