package br.com.empresa_aerea.ms_cliente.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Entity
@Table(name = "transacoes_milhas")
public class TransacaoMilhas {

    private static final Logger logger = LoggerFactory.getLogger(TransacaoMilhas.class);
    // Logger adicionado para ver as trasacoes
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Long id;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    @Column(nullable = false)
    private String tipo; // ENTRADA ou SAÍDA

    @Column(nullable = false)
    private Integer quantidade;

    @Column(name = "valor_reais")
    private Double valorReais;

    @Column(length = 255)
    private String descricao;

    @Column(name = "codigo_reserva")
    private String codigoReserva;

    /** Associação com o cliente que realizou a transação */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    // Getters e Setters
    public Long getId() { return id; }
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
    public Double getValorReais() { return valorReais; }
    public void setValorReais(Double valorReais) { this.valorReais = valorReais; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public String getCodigoReserva() { return codigoReserva; }
    public void setCodigoReserva(String codigoReserva) { this.codigoReserva = codigoReserva; }
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
}
