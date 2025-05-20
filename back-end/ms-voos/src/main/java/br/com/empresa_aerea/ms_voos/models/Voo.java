package br.com.empresa_aerea.ms_voos.models;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import br.com.empresa_aerea.ms_voos.enums.EstadoVooEnum;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
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
@Table(name = "voo")
public class Voo {
    
    @Id
    @Column(name = "codigo_voo", length = 8)
    private String codigoVoo;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "data_voo", nullable = false)
    private OffsetDateTime dataVoo;

    @Column(name = "valor_passagem", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorPassagem;

    @Column(name = "quantidade_poltronas_total", nullable = false)
    private Integer quantidadePoltronasTotal;

    @Column(name = "quantidade_poltronas_ocupadas", nullable = false)
    private Integer quantidadePoltronasOcupadas;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "codigo_aeroporto_origem", referencedColumnName = "codigo_aeroporto", nullable = false)
    private Aeroporto aeroportoOrigem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "codigo_aeroporto_destino", referencedColumnName = "codigo_aeroporto", nullable = false)
    private Aeroporto aeroportoDestino;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_estado_voo", referencedColumnName = "id_estado_voo", nullable = false)
    private EstadoVooEnum estadoVoo;

}