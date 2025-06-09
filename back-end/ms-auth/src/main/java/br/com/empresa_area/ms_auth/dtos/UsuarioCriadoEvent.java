package br.com.empresa_area.ms_auth.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor 
@AllArgsConstructor 
public class UsuarioCriadoEvent {
    private String email;
    private String senha;
    private String tipo;
}