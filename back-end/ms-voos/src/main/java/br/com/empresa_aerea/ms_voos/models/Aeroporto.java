package br.com.empresa_aerea.ms_voos.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "aeroporto")
public class Aeroporto {

    @Id
    @Column(name = "codigo_aeroporto", length = 3)
    private String codigoAeroporto;

    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @Column(name = "cidade", nullable = false, length = 50)
    private String cidade;

    @Column(name = "estado", nullable = false, length = 50)
    private String estado;
    
}