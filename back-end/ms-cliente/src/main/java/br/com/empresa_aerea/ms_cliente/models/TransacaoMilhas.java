package br.com.empresa_aerea.ms_cliente.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "transacoes_milhas")
public class TransacaoMilhas  {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
   
    private LocalDateTime dataHora;

    /** Tipo da transação: ENTRADA ou SAÍDA */
    private String tipo;
   
    private Integer quantidade;

    private Double valorReais;
   
    private String descricao;

    /** Código da reserva relacinado*/
    private String codigoReserva;

    /** Cliente associado s transavcao*/
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

}