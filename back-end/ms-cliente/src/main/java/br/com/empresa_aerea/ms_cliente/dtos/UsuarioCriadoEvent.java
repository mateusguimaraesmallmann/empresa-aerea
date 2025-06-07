package br.com.empresa_aerea.ms_cliente.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UsuarioCriadoEvent {

    private String email;
    private String senha;
    private String tipo;
}

