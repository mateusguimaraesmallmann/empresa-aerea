package br.com.empresa_aerea.saga.controllers;

import br.com.empresa_aerea.saga.dtos.ClienteCadastroRequestDTO;
import br.com.empresa_aerea.saga.services.SagaClienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import org.springframework.beans.factory.annotation.Autowired;

@Component
@RestController
@RequestMapping("/saga/ms-cliente")
@CrossOrigin(origins = "*")
public class SagaClienteController {

    @Autowired
    private SagaClienteService sagaClienteService;

    @PostMapping("/clientes")
    public ResponseEntity<Object> cadastrarCliente(@Validated @RequestBody ClienteCadastroRequestDTO body) {
        return sagaClienteService.processarCadastroCliente(body);
    }
}