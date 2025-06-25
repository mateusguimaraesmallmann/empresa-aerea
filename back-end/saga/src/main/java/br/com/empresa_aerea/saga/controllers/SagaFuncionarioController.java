package br.com.empresa_aerea.saga.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.empresa_aerea.saga.dtos.FuncionarioAlteracaoRequestDTO;
import br.com.empresa_aerea.saga.dtos.FuncionarioCadastroRequestDTO;
import br.com.empresa_aerea.saga.services.SagaFuncionarioService;

@Component
@RestController
@RequestMapping("/saga/ms-funcionario")
@CrossOrigin(origins = "*")
public class SagaFuncionarioController {

    private static final Logger logger = LoggerFactory.getLogger(SagaFuncionarioController.class);

    @Autowired
    private SagaFuncionarioService sagaFuncionarioService;

    @PostMapping("/funcionarios")
    public ResponseEntity<?> criar(@Validated @RequestBody FuncionarioCadastroRequestDTO body) {
        try {
            ResponseEntity<?> func = sagaFuncionarioService.criar(body);
            return ResponseEntity.status(HttpStatus.CREATED).body(func);
        } catch (Exception e) {
            logger.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/funcionarios/{codigo}")
    public ResponseEntity<?> alterar(@Validated @RequestBody FuncionarioAlteracaoRequestDTO body, @PathVariable String codigo) {
        try {
            ResponseEntity<?> func = sagaFuncionarioService.alterar(body, codigo);
            return ResponseEntity.status(HttpStatus.CREATED).body(func);
        } catch (Exception e) {
            logger.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }   
    }
    
}