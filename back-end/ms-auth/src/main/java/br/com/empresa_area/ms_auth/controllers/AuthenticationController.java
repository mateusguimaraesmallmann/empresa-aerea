package br.com.empresa_area.ms_auth.controllers;

import br.com.empresa_area.ms_auth.dtos.LoginDTO;
import br.com.empresa_area.ms_auth.services.AuthorizationService;
import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    /*private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    @Autowired
    private AuthorizationService authorizationService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginDTO loginRequest) {

        logger.info("Recebido para processamento LOGIN: login: " + loginRequest.getLogin() + " senha: " + loginRequest.getSenha());

        Map<String, Object> response = authorizationService.login(loginRequest);
        return ResponseEntity.ok(response);
    }*/

}