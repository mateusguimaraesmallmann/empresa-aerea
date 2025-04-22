package br.com.empresa_area.ms_auth.controllers;

import org.slf4j.LoggerFactory;

import java.util.Map;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import br.com.empresa_area.ms_auth.dtos.LoginDTO;
import br.com.empresa_area.ms_auth.dtos.TokenDTO;
import br.com.empresa_area.ms_auth.services.AuthorizationService;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    @Autowired
    AuthorizationService authorizationService;

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody @Validated LoginDTO loginDTO) {
        try {
            TokenDTO token = authorizationService.login(loginDTO);
            return ResponseEntity.status(HttpStatus.OK).body(token);
        } catch (BadCredentialsException e) {
            logger.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Object> logout() {
        return ResponseEntity.ok(Map.of("auth", false, "token", null));
    }
    
}