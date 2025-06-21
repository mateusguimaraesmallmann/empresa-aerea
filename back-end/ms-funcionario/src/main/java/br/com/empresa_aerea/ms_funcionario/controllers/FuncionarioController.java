package br.com.empresa_aerea.ms_funcionario.controllers;

import br.com.empresa_aerea.ms_funcionario.dtos.FuncionarioDTO;
import br.com.empresa_aerea.ms_funcionario.exceptions.FuncionarioNotFoundException;
import br.com.empresa_aerea.ms_funcionario.models.Funcionario;
import br.com.empresa_aerea.ms_funcionario.services.FuncionarioService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/funcionarios")
public class FuncionarioController {

    private final FuncionarioService funcionarioService;

    public FuncionarioController(FuncionarioService funcionarioService) {
        this.funcionarioService = funcionarioService;
    }

    @PostMapping
    public ResponseEntity<Funcionario> criar(@Valid @RequestBody FuncionarioDTO dto) {
        Funcionario criado = funcionarioService.salvar(dto);
        return ResponseEntity.status(201).body(criado);
    }

    @GetMapping
    public List<Funcionario> listarTodos() {
        return funcionarioService.listarTodos();
    }

    @GetMapping("/{cpf}")
    public ResponseEntity<Funcionario> buscarPorCpf(@PathVariable String cpf) {
        try {
            Funcionario funcionario = funcionarioService.buscarPorCpf(cpf);
            return ResponseEntity.ok(funcionario);
        } catch (FuncionarioNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{cpf}")
    public ResponseEntity<Funcionario> atualizar(@PathVariable String cpf, @Valid @RequestBody FuncionarioDTO dto) {
        try {
            Funcionario atualizado = funcionarioService.atualizar(cpf, dto);
            return ResponseEntity.ok(atualizado);
        } catch (FuncionarioNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{cpf}")
    public ResponseEntity<Void> delete(@PathVariable String cpf) {
        try {
            funcionarioService.remover(cpf);
            return ResponseEntity.noContent().build();
        } catch (FuncionarioNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{cpf}/inativar")
    public ResponseEntity<Funcionario> inativarFuncionario(@PathVariable String cpf) {
        try {
            Funcionario funcionario = funcionarioService.alterarStatus(cpf, false);
            return ResponseEntity.ok(funcionario);
        } catch (FuncionarioNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{cpf}/reativar")
    public ResponseEntity<Funcionario> reativarFuncionario(@PathVariable String cpf) {
        try {
            Funcionario funcionario = funcionarioService.alterarStatus(cpf, true);
            return ResponseEntity.ok(funcionario);
        } catch (FuncionarioNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
}