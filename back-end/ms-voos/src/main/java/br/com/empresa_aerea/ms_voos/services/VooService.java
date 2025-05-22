package br.com.empresa_aerea.ms_voos.services;

import br.com.empresa_aerea.ms_voos.enums.EstadoVooEnum;
import br.com.empresa_aerea.ms_voos.models.Aeroporto;
import br.com.empresa_aerea.ms_voos.models.Voo;
import br.com.empresa_aerea.ms_voos.repositories.AeroportoRepository;
import br.com.empresa_aerea.ms_voos.repositories.VooRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VooService {

    private final VooRepository vooRepository;
    private final AeroportoRepository aeroportoRepository;

    public VooService(VooRepository vooRepository, AeroportoRepository aeroportoRepository) {
        this.vooRepository = vooRepository;
        this.aeroportoRepository = aeroportoRepository;
    }

    private LocalDateTime agora() {
        return LocalDateTime.now();
    }

    @Transactional
    public Voo criar(Voo voo) {
        Aeroporto origem = aeroportoRepository.findById(voo.getOrigem().getCodigoAeroporto())
                .orElseThrow(() -> new IllegalArgumentException("Aeroporto de origem não encontrado"));

        Aeroporto destino = aeroportoRepository.findById(voo.getDestino().getCodigoAeroporto())
                .orElseThrow(() -> new IllegalArgumentException("Aeroporto de destino não encontrado"));

        voo.setOrigem(origem);
        voo.setDestino(destino);
        voo.setEstado(EstadoVooEnum.CONFIRMADO);
        return vooRepository.save(voo);
    }

    public List<Voo> listarTodos() {
        return vooRepository.findByDataHoraAfterOrderByDataHoraAsc(agora());
    }

    public List<Voo> buscar(String origemCod, String destinoCod) {
        if (origemCod != null && destinoCod != null) {
            return buscarPorOrigemEDestino(origemCod, destinoCod);
        }
        return listarTodos();
    }

    private List<Voo> buscarPorOrigemEDestino(String origemCod, String destinoCod) {
        Aeroporto origem = aeroportoRepository.findById(origemCod)
                .orElseThrow(() -> new IllegalArgumentException("Aeroporto de origem não encontrado"));

        Aeroporto destino = aeroportoRepository.findById(destinoCod)
                .orElseThrow(() -> new IllegalArgumentException("Aeroporto de destino não encontrado"));

        return vooRepository.findByOrigemAndDestinoAndDataHoraAfterOrderByDataHoraAsc(origem, destino, agora());
    }

    public Voo buscarPorCodigo(String codigo) {
        return vooRepository.findById(codigo)
                .orElseThrow(() -> new IllegalArgumentException("Voo com código " + codigo + " não encontrado"));
    }

    @Transactional
    public Voo atualizarEstado(String codigo, EstadoVooEnum novoEstado) {
        Voo voo = buscarPorCodigo(codigo);
        voo.setEstado(novoEstado);
        return vooRepository.save(voo);
    }
}