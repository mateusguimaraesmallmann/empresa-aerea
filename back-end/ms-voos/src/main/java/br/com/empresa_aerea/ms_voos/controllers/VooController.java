package br.com.empresa_aerea.ms_voos.controllers;

import br.com.empresa_aerea.ms_voos.models.Voo;
//import br.com.empresa_aerea.ms_voos.model.Cliente;
import br.com.empresa_aerea.ms_voos.services.VooService;
//import br.com.empresa_aerea.ms_voos.services.ClienteService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api")
public class VooController {

    private final VooService vooService;
    //private final ClienteService clienteService;

    public VooController(VooService vooService/*, ClienteService clienteService*/) {
        this.vooService = vooService;
        //this.clienteService = clienteService;
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

    //@GetMapping("/cliente/{cpf}")
    //public Cliente buscarCliente(@PathVariable String cpf) {
    //    return clienteService.buscarPorCpf(cpf);
    //}
}
