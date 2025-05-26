package br.com.empresa_area.ms_auth.dtos;

import br.com.empresa_area.ms_auth.enums.TipoUsuario;
import lombok.Data;

@Data
public class UsuarioCriadoEvent {
    private String email;
    private String senha;
    private TipoUsuario tipo;
}

