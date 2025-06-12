package br.com.empresa_area.ms_auth.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioRequestCadastrarDTO {

    private String email;
    private String senha = "";
    private String tipo = "CLIENTE";
    
}