package br.com.empresa_area.ms_auth.dtos;

import br.com.empresa_area.ms_auth.enums.TipoUsuario;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponseDTO  {

    private String email;
    private TipoUsuario tipo;
    private String errorMessage;
}