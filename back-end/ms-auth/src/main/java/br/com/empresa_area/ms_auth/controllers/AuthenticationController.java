package br.com.empresa_area.ms_auth.controllers;

import br.com.empresa_area.ms_auth.services.AuthorizationService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    /*@Autowired
    private AuthorizationService service;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginDTO loginRequest) {

        Map<String, Object> response = service.login(loginRequest);
        return ResponseEntity.ok(response);
    }*/

}