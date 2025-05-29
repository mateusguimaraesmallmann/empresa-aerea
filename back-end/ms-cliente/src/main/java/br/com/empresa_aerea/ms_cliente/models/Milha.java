package br.com.empresa_aerea.ms_cliente.models;

import java.io.Serializable;
import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;

import br.com.empresa_aerea.ms_cliente.enums.TipoTransacaoEnum;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "milhas")
public class Milha implements Serializable {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id_milhas")
    private Long idMilhas = 0L;

    @CreationTimestamp
    @Column(name = "data_transacao", nullable = false)
    private OffsetDateTime dataTransacao;

    @Column(name="valor_reais", nullable = false)
    private Double valorReais;

    @Column(name="quantidade_milhas", nullable = false)
    private Integer quantidadeMilhas;

    @Column(name="descricao", nullable = false)
    private String descricao = "COMPRA DE MILHAS";

//    @Column(name="codigo_reserva")
//    private String codigoReserva;

    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @Enumerated(EnumType.STRING)
    @Column(name="tipo_transacao", insertable = false, updatable = false, nullable = false, unique = true)
    private TipoTransacaoEnum tipoTransacao = TipoTransacaoEnum.ENTRADA;
    
}