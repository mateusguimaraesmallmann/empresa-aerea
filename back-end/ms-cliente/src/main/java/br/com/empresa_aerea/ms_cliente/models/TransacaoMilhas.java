package br.com.empresa_aerea.ms_cliente.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "transacoes_milhas")
public class TransacaoMilhas {

   
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

    // ==============================
    // Getters e Setters
    // ==============================

    public Long getId() {
        return id;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public Double getValorReais() {
        return valorReais;
    }

    public void setValorReais(Double valorReais) {
        this.valorReais = valorReais;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getCodigoReserva() {
        return codigoReserva;
    }

    public void setCodigoReserva(String codigoReserva) {
        this.codigoReserva = codigoReserva;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
}