package com.empresaarea.backend.controller;

import com.empresaarea.backend.model.Funcionario;
import com.empresaarea.backend.services.FuncionarioService;
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
    public Funcionario criar(@RequestBody Funcionario funcionario) {
        return funcionarioService.salvar(funcionario);
    }

    @GetMapping
    public List<Funcionario> listarTodos() {
        return funcionarioService.listarTodos();
    }

    @GetMapping("/{email}")
    public Funcionario buscarPorEmail(@PathVariable String email) {
        return funcionarioService.buscarPorEmail(email);
    }
}