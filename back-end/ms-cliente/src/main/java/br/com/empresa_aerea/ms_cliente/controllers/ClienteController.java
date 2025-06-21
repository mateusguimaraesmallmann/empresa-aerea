package br.com.empresa_aerea.ms_cliente.controllers;

import br.com.empresa_aerea.ms_cliente.models.Cliente;
import br.com.empresa_aerea.ms_cliente.services.ClienteService;
//import br.com.empresa_aerea.ms_cliente.exceptions.ClienteJaExisteException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ms-cliente")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
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

    @PutMapping("/clientes/{id}/milhas")
    public ResponseEntity<?> atualizarMilhas(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> payload) {

        if (!payload.containsKey("quantidade")) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Campo 'quantidade' é obrigatório"));
        }

        try {
            int quantidade = payload.get("quantidade");
            Map<String, Object> response = clienteService.atualizarMilhas(id, quantidade);
            return ResponseEntity.ok(response);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("erro", ex.getMessage()));
        }
    }

    @GetMapping("/clientes/{id}/milhas")
    public ResponseEntity<?> extratoMilhas(@PathVariable Long id) {
        try {
            Map<String, Object> response = clienteService.listarExtratoMilhas(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("erro", ex.getMessage()));
        }
    }
}

