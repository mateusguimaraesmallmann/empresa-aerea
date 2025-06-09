package br.com.empresa_aerea.ms_voos.dto;

import br.com.empresa_aerea.ms_voos.enums.EstadoVooEnum;

public class AtualizarEstadoDTO {
    private EstadoVooEnum estado;

    public EstadoVooEnum getEstado() {
        return estado;
    }

    public void setEstado(EstadoVooEnum estado) {
        this.estado = estado;
    }
}
