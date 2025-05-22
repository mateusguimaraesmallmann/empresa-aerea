package br.com.empresa_area.ms_auth.controllers;

import br.com.empresa_area.ms_auth.dtos.LoginDTO;
import br.com.empresa_area.ms_auth.dtos.RegisterDTO;
import br.com.empresa_area.ms_auth.dtos.TokenResponseDTO;
import br.com.empresa_area.ms_auth.dtos.UserDTO;
import br.com.empresa_area.ms_auth.models.Usuario;
import br.com.empresa_area.ms_auth.services.AuthorizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired
    private AuthorizationService authorizationService;

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDTO> login(@RequestBody LoginDTO dto) {
        Usuario usuario = authorizationService.login(dto);
        return ResponseEntity.ok(
            new TokenResponseDTO(
                usuario.getId(),
                usuario.getLogin(),
                usuario.getRole(),
                authorizationService.generateToken(usuario)
            )
        );
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody RegisterDTO dto) {
        Usuario usuario = authorizationService.register(dto);
        return ResponseEntity.ok(new UserDTO(
            usuario.getId(),
            usuario.getLogin(),
            usuario.getRole()
        ));
    }
}
