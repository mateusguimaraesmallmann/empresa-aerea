package br.com.empresa_aerea.ms_voos.services;

import br.com.empresa_aerea.ms_voos.enums.EstadoVooEnum;
import br.com.empresa_aerea.ms_voos.models.Voo;
import br.com.empresa_aerea.ms_voos.repositories.VooRepository;
import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class VooService {

    private final VooRepository vooRepository;

    public VooService(VooRepository vooRepository) {
        this.vooRepository = vooRepository;
    }

    @Transactional
    public Voo criar(Voo voo) {
        voo.setCodigo(voo.getCodigo());
        voo.setEstado(EstadoVooEnum.CONFIRMADO);
        return vooRepository.save(voo);
    }

    public List<Voo> listarTodos() {
        OffsetDateTime agora = OffsetDateTime.now();
        return vooRepository.findByDataHoraAfterOrderByDataHoraAsc(agora);
    }

    public List<Voo> buscar(String origem, String destino) {
        OffsetDateTime agora = OffsetDateTime.now();
        if (origem != null && destino != null) {
            return vooRepository.findByOrigemAndDestinoAndDataHoraAfterOrderByDataHoraAsc(origem, destino, agora);
        }
        return listarTodos();
    }

    public Voo buscarPorCodigo(String codigo) {
        return vooRepository.findById(codigo)
                .orElseThrow(() -> new IllegalArgumentException("Voo não encontrado"));
    }

    @Transactional
    public Voo atualizarEstado(String codigo, EstadoVooEnum novoEstado) {
        Voo voo = buscarPorCodigo(codigo);
        voo.setEstado(novoEstado);
        return vooRepository.save(voo);
    }

}