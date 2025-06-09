package br.com.empresa_aerea.saga.events;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisteredEvent {

    private String userId;
    private String cpf;
    private String nome;
    private String email;
    private String cep;
    private String senha;
}