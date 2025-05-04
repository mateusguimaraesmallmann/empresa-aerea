package br.com.empresa_aerea.ms_voos.models;

import br.com.empresa_aerea.ms_voos.enums.EstadoVooEnum;
import jakarta.persistence.Entity;
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
@Table(name = "voo")
public class Voo {
    
    private String codigo;
    private String dataHora;
    private String origem;
    private String destino;
    private String status;
    private EstadoVooEnum estado;
}
