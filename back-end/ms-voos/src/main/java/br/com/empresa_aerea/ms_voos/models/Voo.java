package br.com.empresa_aerea.ms_voos.models;

import br.com.empresa_aerea.ms_voos.enums.EstadoVooEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "voo")
public class Voo {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String codigo;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    @ManyToOne
    @JoinColumn(name = "origem_id", nullable = false)
    private Aeroporto origem;

    @ManyToOne
    @JoinColumn(name = "destino_id", nullable = false)
    private Aeroporto destino;

    @Column(name = "preco", nullable = false)
    private double preco;

    @Column(name = "poltronas", nullable = false)
    private int poltronas;

    @Column(name = "poltronas_ocupadas", nullable = false)
    private int poltronasOcupadas;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoVooEnum estado;
}