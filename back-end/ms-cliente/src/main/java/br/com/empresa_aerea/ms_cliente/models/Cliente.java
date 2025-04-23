package br.com.empresa_aerea.ms_cliente.models;

import lombok.Data;
import lombok.Getter;

import java.io.Serializable;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "cliente")
public class Cliente implements Serializable {
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="cliente_id")
    private Long idCliente = 0L;

    @Column(name="cpf", unique = true)
    private String cpf;

    @Column(name="nome", nullable = false)
    private String nome;
    
    @Column(name="email", unique = true)
    private String email;

    @Column(name="saldo_milhas", insertable = false, nullable = false)
    private Integer milhas;

    @OneToOne(cascade=CascadeType.ALL)
    @JoinColumn(name="id_endereco", nullable = false)
    private Endereco endereco;
}