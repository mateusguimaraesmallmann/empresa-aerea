package br.com.empresa_area.ms_auth.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ClienteDTO {

    private Long idCliente;
    private String cpf;
    private String email;
    private String nome;
    private Integer saldoMilhas;
    private String tipo;
    private String senha;
    
}