package br.com.empresa_aerea.ms_cliente.controllers;

import br.com.empresa_aerea.ms_cliente.models.Cliente;
import br.com.empresa_aerea.ms_cliente.services.ClienteService;
import br.com.empresa_aerea.ms_cliente.exceptions.ClienteJaExisteException;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ms-cliente")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping("/clientes")
    public ResponseEntity<?> criar(@RequestBody Cliente cliente) {
        try {
            Cliente clienteEntity = clienteService.salvar(cliente);
            return ResponseEntity.status(HttpStatus.CREATED).body(clienteEntity);
        } catch (ClienteJaExisteException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("erro", ex.getMessage()));
        }
    }

    @GetMapping
    public List<Cliente> listarTodos() {
        return clienteService.listarTodos();
    }

    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Cliente> buscarPorCpf(@PathVariable String cpf) {
        return clienteService.buscarPorCpf(cpf)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/por-email/{email}")
    public ResponseEntity<Cliente> buscarPorEmail(@PathVariable String email) {
        return clienteService.buscarPorEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Atualizar saldo de milhas (PUT)
    @PutMapping("/clientes/{id}/milhas")
    public ResponseEntity<Map<String, Object>> atualizarMilhas(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> payload) {
        if (!payload.containsKey("quantidade")) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Campo 'quantidade' é obrigatório"));
        }

        int quantidade = payload.get("quantidade");
        Map<String, Object> response = clienteService.atualizarMilhas(id, quantidade);
        return ResponseEntity.ok(response);
    }

    // Obter extrato de milhas (GET)
    @GetMapping("/clientes/{id}/milhas")
    public ResponseEntity<Map<String, Object>> extratoMilhas(@PathVariable Long id) {
        Map<String, Object> response = clienteService.listarExtratoMilhas(id);
        return ResponseEntity.ok(response);
    }
}
