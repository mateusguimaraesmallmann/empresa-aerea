package br.com.empresa_aerea.ms_funcionario.controllers;

import br.com.empresa_aerea.ms_funcionario.dtos.FuncionarioDTO;
import br.com.empresa_aerea.ms_funcionario.dtos.FuncionarioListDTO;
import br.com.empresa_aerea.ms_funcionario.services.FuncionarioService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/ms-funcionario")
public class FuncionarioController {

    private static final Logger logger = LoggerFactory.getLogger(FuncionarioController.class);

    @Autowired
    private FuncionarioService funcionarioService;

    @GetMapping("/funcionarios")
    public ResponseEntity<?> listarTodos() {
        try {
            List<FuncionarioListDTO> lista = funcionarioService.listarTodos();
            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            logger.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }   
    }

    @GetMapping("/funcionarios/{codigo}")
    public ResponseEntity<?> buscarPorCodigo(@PathVariable String codigo) {
        try {
            FuncionarioDTO func = funcionarioService.buscarPorCodigo(codigo);
            return ResponseEntity.ok(func);
        } catch (Exception e) {
            logger.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }   
    }

    @DeleteMapping("/funcionarios/{codigoFuncionario}")
    public ResponseEntity<?> delete() {
        try {
            List<FuncionarioListDTO> lista = funcionarioService.listarTodos();
            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            logger.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }   
    }

}