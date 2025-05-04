package br.com.empresa_aerea.ms_funcionario.models;

import lombok.Data;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "funcionarios")
public class Funcionario {

    private String cpf;
    private String email;
    private String nome;
    private String senha;
    private String dataNascimento;
    private String telefone;
}
