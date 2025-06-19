package br.com.empresa_aerea.ms_cliente.controllers;
import java.util.Map;
import br.com.empresa_aerea.ms_cliente.models.Cliente;
import br.com.empresa_aerea.ms_cliente.models.TransacaoMilhas;
import br.com.empresa_aerea.ms_cliente.repositories.ClienteRepository;
import br.com.empresa_aerea.ms_cliente.services.TransacaoMilhasService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/ms-cliente/milhas")
public class TransacaoMilhasController {

    private final TransacaoMilhasService transacaoMilhasService;
    private final ClienteRepository clienteRepository;

    public TransacaoMilhasController(TransacaoMilhasService transacaoMilhasService, ClienteRepository clienteRepository) {
        this.transacaoMilhasService = transacaoMilhasService;
        this.clienteRepository = clienteRepository;
    }

    @PostMapping("/comprar")
    public ResponseEntity<?> comprarMilhas(
            @RequestParam Long clienteId,
            @RequestParam int quantidade,
            @RequestParam double valorReais,
            @RequestParam(required = false) String codigoReserva) {

        Optional<Cliente> clienteOpt = clienteRepository.findById(clienteId);
        if (clienteOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Cliente não encontrado");
        }

        transacaoMilhasService.registrarCompra(clienteOpt.get(), quantidade, valorReais, codigoReserva);
        return ResponseEntity.ok("Compra de milhas registrada com sucesso");
    }

    @GetMapping("/{clienteId}")
public ResponseEntity<?> listarMilhas(@PathVariable Long clienteId) {
    Optional<Cliente> clienteOpt = clienteRepository.findById(clienteId);
    if (clienteOpt.isEmpty()) {
        return ResponseEntity.badRequest().body("Cliente não encontrado");
    }

    List<TransacaoMilhas> extrato = transacaoMilhasService.listarPorCliente(clienteOpt.get());
    return ResponseEntity.ok(Map.of("transacoes", extrato));

    }
}


