package br.com.empresa_aerea.saga.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDTO {

    private String access_token;
    private String token_type;
    private String tipo;
    private Object usuario;

}