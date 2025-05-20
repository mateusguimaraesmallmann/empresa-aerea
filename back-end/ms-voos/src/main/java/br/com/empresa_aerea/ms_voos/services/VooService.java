package br.com.empresa_aerea.ms_voos.services;

import br.com.empresa_aerea.ms_voos.enums.EstadoVooEnum;
import br.com.empresa_aerea.ms_voos.models.Voo;
import br.com.empresa_aerea.ms_voos.repositories.VooRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class VooService {

    private final VooRepository vooRepository;

    public VooService(VooRepository vooRepository) {
        this.vooRepository = vooRepository;
    }

    private OffsetDateTime agora() {
        return OffsetDateTime.now();
    }

    @Transactional
    public Voo criar(Voo voo) {
        voo.setCodigoVoo(voo.getCodigoVoo());
        voo.setEstadoVoo(EstadoVooEnum.CONFIRMADO);
        return vooRepository.save(voo);
    }

    public List<Voo> listarTodos() {
        return vooRepository.findByDataHoraAfterOrderByDataHoraAsc(agora());
    }

    public List<Voo> buscar(String origem, String destino) {
        return origem != null && destino != null
            ? buscarPorOrigemEDestino(origem, destino)
            : listarTodos();
    }

    private List<Voo> buscarPorOrigemEDestino(String origem, String destino) {
        return vooRepository.findByOrigemAndDestinoAndDataHoraAfterOrderByDataHoraAsc(origem, destino, agora());
    }

    public Voo buscarPorCodigo(String codigo) {
        return vooRepository.findById(codigo)
            .orElseThrow(() -> new IllegalArgumentException("Voo com código " + codigo + " não encontrado"));
    }

    @Transactional
    public Voo atualizarEstado(String codigo, EstadoVooEnum novoEstado) {
        Voo voo = buscarPorCodigo(codigo);
        voo.setEstadoVoo(novoEstado);
        return vooRepository.save(voo);
    }
}
