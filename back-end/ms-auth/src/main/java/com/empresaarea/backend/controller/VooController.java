package com.empresaarea.backend.controller;

import com.empresaarea.backend.model.Voo;
import com.empresaarea.backend.model.Cliente;
import com.empresaarea.backend.services.VooService;
import com.empresaarea.backend.services.ClienteService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api")
public class VooController {

    private final VooService vooService;
    private final ClienteService clienteService;

    public VooController(VooService vooService, ClienteService clienteService) {
        this.vooService = vooService;
        this.clienteService = clienteService;
    }

    @GetMapping("/voos")
    public List<Voo> listarVoos() {
        return vooService.listarTodos();
    }

    @GetMapping("/reserva")
    public Optional<Voo> verReserva(@RequestParam String dataHora) {
        return vooService.buscarReserva(dataHora);
    }

    @PostMapping("/cancelar")
    public String cancelarReserva(@RequestParam String dataHora) {
        boolean cancelado = vooService.cancelarReserva(dataHora);
        return cancelado ? "Reserva cancelada." : "Reserva não foi encontrada.";
    }

    @GetMapping("/cliente/{cpf}")
    public Cliente buscarCliente(@PathVariable String cpf) {
        return clienteService.buscarPorCpf(cpf);
    }
}
