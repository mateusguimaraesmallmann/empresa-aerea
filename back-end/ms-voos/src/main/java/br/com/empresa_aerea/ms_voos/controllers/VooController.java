package br.com.empresa_aerea.ms_voos.controllers;

import br.com.empresa_aerea.ms_voos.dto.BuscarVoosResponseDTO;
import br.com.empresa_aerea.ms_voos.dto.CriarVooDTO;
import br.com.empresa_aerea.ms_voos.dto.VooDTO;
import br.com.empresa_aerea.ms_voos.enums.EstadoVooEnum;
import br.com.empresa_aerea.ms_voos.models.Aeroporto;
import br.com.empresa_aerea.ms_voos.models.Voo;
import br.com.empresa_aerea.ms_voos.services.AeroportoService;
import br.com.empresa_aerea.ms_voos.services.VooService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/ms-voos")
public class VooController {

    private final VooService vooService;
    private final AeroportoService aeroportoService;

    public VooController(VooService vooService, AeroportoService aeroportoService) {
        this.vooService = vooService;
        this.aeroportoService = aeroportoService;
    }

    @PostMapping("/voos")
    public ResponseEntity<Voo> criarVoo(@RequestBody CriarVooDTO dto) {
        Aeroporto origem = aeroportoService.buscarPorCodigo(dto.getOrigemCodigo());
        Aeroporto destino = aeroportoService.buscarPorCodigo(dto.getDestinoCodigo());

        Voo novo = new Voo(
            dto.getId(),
            dto.getCodigo(),
            dto.getDataHora(),
            origem,
            destino,
            dto.getPreco(),
            dto.getPoltronas(),
            dto.getPoltronasOcupadas(),
            dto.getEstado()
        );

        Voo salvo = vooService.criar(novo);
        return ResponseEntity.status(201).body(salvo);
    }

    // busca voos por data, origem e destino no formato exigido
    @GetMapping("/voos")
    public ResponseEntity<BuscarVoosResponseDTO> buscarVoosPorDataOrigemDestino(
            @RequestParam String data,
            @RequestParam String origem,
            @RequestParam String destino) {

        List<Voo> voosFiltrados = vooService.buscar(origem, destino).stream()
                .filter(voo -> voo.getDataHora().toLocalDate().toString().equals(data))
                .collect(Collectors.toList());

        List<VooDTO> voosDTO = voosFiltrados.stream().map(voo -> {
            VooDTO dto = new VooDTO();
            dto.setCodigo(voo.getCodigo());
            dto.setData(voo.getDataHora());
            dto.setValor_passagem(voo.getPreco());
            dto.setQuantidade_poltronas_total(voo.getPoltronas());
            dto.setQuantidade_poltronas_ocupadas(voo.getPoltronasOcupadas());
            dto.setEstado(voo.getEstado());
            dto.setAeroporto_origem(voo.getOrigem());
            dto.setAeroporto_destino(voo.getDestino());
            return dto;
        }).toList();

        BuscarVoosResponseDTO resposta = new BuscarVoosResponseDTO();
        resposta.setData(LocalDate.parse(data));
        resposta.setOrigem(origem);
        resposta.setDestino(destino);
        resposta.setVoos(voosDTO);

        return ResponseEntity.ok(resposta);
    }

    @GetMapping("/voos/{codigoVoo}")
    public ResponseEntity<Voo> buscarPorCodigo(@PathVariable String codigoVoo) {
        return ResponseEntity.ok(vooService.buscarPorCodigo(codigoVoo));
    }

    @PatchMapping("/voos/{codigoVoo}/estado")
    public ResponseEntity<Voo> atualizarEstado(
            @PathVariable String codigoVoo,
            @RequestBody EstadoVooEnum estado) {
        Voo atualizado = vooService.atualizarEstado(codigoVoo, estado);
        return ResponseEntity.ok(atualizado);
    }
    
    @GetMapping("/voos/listar")
    public ResponseEntity<List<Voo>> listarTodosVoos() {
        return ResponseEntity.ok(vooService.listarTodos());
    }

    @GetMapping("/aeroportos")
    public List<Aeroporto> listarAeroportos() {
        return aeroportoService.listarTodos();
    }
}