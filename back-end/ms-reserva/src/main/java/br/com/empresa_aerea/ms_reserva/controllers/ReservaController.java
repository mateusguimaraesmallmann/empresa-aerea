package br.com.empresa_aerea.ms_reserva.controllers;

import br.com.empresa_aerea.ms_reserva.dtos.ReservaDTO;
import br.com.empresa_aerea.ms_reserva.dtos.ReservaResponseDTO;
import br.com.empresa_aerea.ms_reserva.enums.EstadoReservaEnum;
import br.com.empresa_aerea.ms_reserva.models.Reserva;
import br.com.empresa_aerea.ms_reserva.services.ReservaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/ms-reserva/reservas")
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @GetMapping
    public ResponseEntity<List<ReservaResponseDTO>> listarPorCliente(@RequestParam(name = "clienteId", required = false) Long clienteId) {
        if (clienteId == null) {
            return ResponseEntity.badRequest().build();
        }
        List<Reserva> reservas = reservaService.listarPorCliente(clienteId);
        List<ReservaResponseDTO> response = reservas.stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ReservaResponseDTO> criar(@RequestBody ReservaDTO dto) {
        System.out.println("DTO recebido: " + dto);
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
    public ResponseEntity<ReservaResponseDTO> atualizarEstado(@PathVariable String codigo, @RequestBody Map<String, String> body) {
        EstadoReservaEnum destino = EstadoReservaEnum.valueOf(body.get("estado"));
        Reserva reserva = reservaService.atualizarEstado(codigo, destino);
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
            reserva.getIdCliente(),
            reserva.getDataHora(),
            reserva.getEstado(),
            reserva.getQuantidadePassagens(),
            reserva.getMilhasUtilizadas(),
            reserva.getValorPagoEmDinheiro()
        );
    }
}

