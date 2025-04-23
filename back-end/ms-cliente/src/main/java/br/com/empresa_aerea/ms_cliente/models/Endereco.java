package br.com.empresa_aerea.ms_cliente.models;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="endereco")
public class Endereco implements Serializable {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="endereco_id")
    private Long idEndereco = 0L;

    @Column(name="cep", nullable = false)
    private String cep;

    @Column(name="estado", nullable = false)
    private String estado;

    @Column(name="cidade", nullable = false)
    private String cidade;

    @Column(name="bairro", nullable = false)
    private String bairro;

    @Column(name="rua", nullable = false)
    private String rua;

    @Column(name="numero", nullable = false)
    private String numero;

    @Column(name="complemento")
    private String complemento;
    
}