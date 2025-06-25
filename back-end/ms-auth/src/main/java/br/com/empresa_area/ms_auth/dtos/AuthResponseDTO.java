package br.com.empresa_area.ms_auth.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;

import br.com.empresa_area.ms_auth.enums.TipoUsuario;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponseDTO {

    private TipoUsuario tipo;
    private String access_token;
    private String errorMessage;
    
}