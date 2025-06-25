package br.com.empresa_aerea.saga.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;

import br.com.empresa_aerea.saga.enums.TipoUsuario;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RegisterResponseDTO {
    private String email;
    private TipoUsuario tipo;
    private String errorMessage;
    private String senha; // senha gerada no ms-auth
}