package br.com.empresa_aerea.ms_voos.services;

import br.com.empresa_aerea.ms_voos.models.Aeroporto;
import br.com.empresa_aerea.ms_voos.repositories.AeroportoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AeroportoService {

    private final AeroportoRepository aeroportoRepository;

    public AeroportoService(AeroportoRepository aeroportoRepository) {
        this.aeroportoRepository = aeroportoRepository;
    }

    public List<Aeroporto> listarTodos() {
        return aeroportoRepository.findAll();
    }

    public Aeroporto buscarPorCodigo(String codigo) {
        return aeroportoRepository.findById(codigo)
            .orElseThrow(() -> new RuntimeException("Aeroporto não encontrado: " + codigo));
    }
}