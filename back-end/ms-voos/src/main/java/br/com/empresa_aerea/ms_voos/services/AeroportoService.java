package br.com.empresa_aerea.ms_voos.services;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.empresa_aerea.ms_voos.models.Aeroporto;
import br.com.empresa_aerea.ms_voos.repositories.AeroportoRepository;

@Service
public class AeroportoService {

    private final AeroportoRepository aeroportoRepository;

    public AeroportoService(AeroportoRepository aeroportoRepository) {
        this.aeroportoRepository = aeroportoRepository;
    }

    public List<Aeroporto> listarTodos() {
        return aeroportoRepository.findAll();
    }
    
}