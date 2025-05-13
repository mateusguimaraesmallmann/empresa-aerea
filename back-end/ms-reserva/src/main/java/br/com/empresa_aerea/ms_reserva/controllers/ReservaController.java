package br.com.empresa_aerea.ms_reserva.controllers;

import br.com.empresa_aerea.ms_reserva.dtos.ReservaDTO;
import br.com.empresa_aerea.ms_reserva.dtos.ReservaResponseDTO;
import br.com.empresa_aerea.ms_reserva.models.Reserva;
import br.com.empresa_aerea.ms_reserva.services.ReservaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ms-reserva")
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @PostMapping
    public ResponseEntity<ReservaResponseDTO> criar(@RequestBody ReservaDTO dto) {
        Reserva reserva = reservaService.criar(dto);
        ReservaResponseDTO response = toResponseDTO(reserva);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<ReservaResponseDTO> buscar(@PathVariable String codigo) {
        Reserva reserva = reservaService.buscar(codigo);
        ReservaResponseDTO response = toResponseDTO(reserva);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{codigo}/estado")
    public ResponseEntity<ReservaResponseDTO> atualizarEstado(@PathVariable String codigo) {
        Reserva reserva = reservaService.atualizarEstado(codigo);
        ReservaResponseDTO response = toResponseDTO(reserva);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{codigo}")
    public ResponseEntity<Void> cancelar(@PathVariable String codigo) {
        reservaService.cancelar(codigo);
        return ResponseEntity.noContent().build();
    }

    private ReservaResponseDTO toResponseDTO(Reserva reserva) {
        return new ReservaResponseDTO(
            reserva.getCodigo(),
            reserva.getCodigoVoo(),
            reserva.getClienteCpf(),
            reserva.getDataHora(),
            reserva.getEstado()
        );
    }
}
