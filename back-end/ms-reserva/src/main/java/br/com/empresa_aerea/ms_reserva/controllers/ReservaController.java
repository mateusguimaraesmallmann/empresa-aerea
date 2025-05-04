package br.com.empresa_aerea.ms_reserva.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.empresa_aerea.ms_reserva.dtos.ReservaDTO;
import br.com.empresa_aerea.ms_reserva.models.Reserva;
import br.com.empresa_aerea.ms_reserva.services.ReservaService;

@RestController
@RequestMapping("/ms-reserva")
public class ReservaController {

    private final ReservaService ReservaService;

    public ReservaController(ReservaService ReservaService) {
        this.ReservaService = ReservaService;
    }

    @PostMapping
    public ResponseEntity<Reserva> criar(@RequestBody ReservaDTO dto) {
        Reserva reserva = ReservaService.criar(dto);
        return ResponseEntity.status(201).body(reserva);
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<Reserva> buscar(@PathVariable String codigo) {
        return ResponseEntity.ok(ReservaService.buscar(codigo));
    }

    @PatchMapping("/{codigo}/estado")
    public ResponseEntity<Reserva> atualizarEstado(@PathVariable String codigo) {
        return ResponseEntity.ok(ReservaService.atualizarEstado(codigo));
    }

    @DeleteMapping("/{codigo}")
    public ResponseEntity<Void> cancelar(@PathVariable String codigo) {
        ReservaService.cancelar(codigo);
        return ResponseEntity.noContent().build();
    }
    
}