package br.com.empresa_aerea.ms_voos.services;

import br.com.empresa_aerea.ms_voos.models.Aeroporto;
import br.com.empresa_aerea.ms_voos.repositories.AeroportoRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.Arrays;
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

    @PostConstruct
    public void inicializarAeroportos() {
        if (aeroportoRepository.count() == 0) {
            aeroportoRepository.saveAll(Arrays.asList(
                new Aeroporto("GRU", "Aeroporto Internacional de São Paulo/Guarulhos", "Guarulhos", "SP"),
                new Aeroporto("GIG", "Aeroporto Internacional do Rio de Janeiro/Galeão", "Rio de Janeiro", "RJ"),
                new Aeroporto("CWB", "Aeroporto Internacional de Curitiba", "Curitiba", "PR"),
                new Aeroporto("POA", "Aeroporto Internacional Salgado Filho", "Porto Alegre", "RS"),
                new Aeroporto("CNF", "Aeroporto Internacional de Confins", "Belo Horizonte", "MG"),
                new Aeroporto("BSB", "Aeroporto Internacional de Brasília", "Brasília", "DF"),
                new Aeroporto("REC", "Aeroporto Internacional do Recife/Guararapes", "Recife", "PE"),
                new Aeroporto("SSA", "Aeroporto Internacional de Salvador", "Salvador", "BA"),
                new Aeroporto("FOR", "Aeroporto Internacional de Fortaleza", "Fortaleza", "CE"),
                new Aeroporto("MAO", "Aeroporto Internacional Eduardo Gomes", "Manaus", "AM"),
                new Aeroporto("VCP", "Aeroporto Internacional de Viracopos", "Campinas", "SP"),
                new Aeroporto("SDU", "Aeroporto Santos Dumont", "Rio de Janeiro", "RJ"),
                new Aeroporto("CGH", "Aeroporto de Congonhas", "São Paulo", "SP"),
                new Aeroporto("CGB", "Aeroporto Marechal Rondon", "Cuiabá", "MT"),
                new Aeroporto("GYN", "Aeroporto de Goiânia/Santa Genoveva", "Goiânia", "GO"),
                new Aeroporto("BEL", "Aeroporto Internacional de Belém/Val-de-Cans", "Belém", "PA"),
                new Aeroporto("MCZ", "Aeroporto Internacional Zumbi dos Palmares", "Maceió", "AL"),
                new Aeroporto("NAT", "Aeroporto Internacional de Natal", "Natal", "RN"),
                new Aeroporto("SLZ", "Aeroporto Marechal Cunha Machado", "São Luís", "MA"),
                new Aeroporto("JPA", "Aeroporto Castro Pinto", "João Pessoa", "PB")
            ));
        }
    }
}