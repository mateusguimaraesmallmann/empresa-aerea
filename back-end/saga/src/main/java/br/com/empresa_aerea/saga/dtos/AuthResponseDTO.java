package br.com.empresa_aerea.saga.dtos;

import br.com.empresa_aerea.saga.enums.TipoUsuario;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {

    private TipoUsuario tipo;
    private String access_token;
    private String errorMessage;
    
}