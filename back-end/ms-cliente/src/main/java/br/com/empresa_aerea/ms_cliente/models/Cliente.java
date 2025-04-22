package br.com.empresa_aerea.ms_cliente.models;

import lombok.Data;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "clientes")
public class Cliente {
    
    private String cpf;
    private String nome;
    private String email;
    private String cep;
    private String ruaNumero;
    private String complemento;
    private String cidade;
    private String uf;
    private int milhas;
}