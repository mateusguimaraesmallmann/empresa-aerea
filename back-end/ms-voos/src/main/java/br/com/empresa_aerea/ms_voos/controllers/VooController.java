package br.com.empresa_aerea.ms_voos.controllers;

import br.com.empresa_aerea.ms_voos.enums.EstadoVooEnum;
import br.com.empresa_aerea.ms_voos.models.Aeroporto;
import br.com.empresa_aerea.ms_voos.models.Voo;
import br.com.empresa_aerea.ms_voos.services.AeroportoService;
import br.com.empresa_aerea.ms_voos.services.VooService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


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
    public ResponseEntity<Voo> criarVoo(@RequestBody Voo voo) {
        Voo criado = vooService.criar(voo);
        return ResponseEntity.status(201).body(criado);
    }

    @GetMapping("/voos")
    public List<Voo> listarVoos() {
        return vooService.listarTodos();
    }

    @GetMapping("/voos/busca")
    public List<Voo> buscarVoos(
            @RequestParam(required = false) String origem,
            @RequestParam(required = false) String destino) {
        return vooService.buscar(origem, destino);
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

    @GetMapping("/aeroportos")
    public List<Aeroporto> listarAeroportos() {
        return aeroportoService.listarTodos();
    }
    
}