package br.com.empresa_area.ms_auth.dtos;

import br.com.empresa_area.ms_auth.enums.TipoUsuario;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDTO {

    private TipoUsuario tipo;
    private String access_token;
    private String errorMessage;
    
}