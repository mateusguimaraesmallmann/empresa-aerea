package br.com.empresa_area.ms_auth.controllers;

import br.com.empresa_area.ms_auth.dtos.LoginDTO;
import br.com.empresa_area.ms_auth.dtos.RegisterDTO;
import br.com.empresa_area.ms_auth.dtos.TokenResponseDTO;
import br.com.empresa_area.ms_auth.dtos.UserDTO;
import br.com.empresa_area.ms_auth.models.Usuario;
import br.com.empresa_area.ms_auth.repositories.UsuarioRepository;
import br.com.empresa_area.ms_auth.services.AuthorizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired
    private AuthorizationService authorizationService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDTO> login(@RequestBody LoginDTO dto) {
        Usuario usuario = authorizationService.login(dto);
        return ResponseEntity.ok(
                new TokenResponseDTO(
                        usuario.getId(),
                        usuario.getLogin(),
                        usuario.getRole(),
                        authorizationService.generateToken(usuario)));
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody RegisterDTO dto) {
        Usuario usuario = authorizationService.register(dto);
        return ResponseEntity.ok(new UserDTO(
                usuario.getId(),
                usuario.getLogin(),
                usuario.getRole()));
    }

    // Endpoint exclusivo para autocadastro via saga
    @PostMapping("/autocadastro")
    public ResponseEntity<Map<String, String>> autocadastrarUsuario(@RequestBody RegisterDTO data) {
        try {
            // Verifica se já existe usuário com o mesmo e-mail
            if (usuarioRepository.existsByEmail(data.email()) || usuarioRepository.existsByCpf(data.cpf())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "CPF ou e-mail já cadastrado"));
            }            

            // Gera senha aleatória segura
            String senhaGerada = gerarSenhaAleatoria();
            String senhaHash = passwordEncoder.encode(senhaGerada);

            // Cria e salva novo usuário
            Usuario usuario = new Usuario();
            usuario.setLogin(data.email());
            usuario.setSenha(senhaHash);
            usuario.setRole(data.tipo());

            usuarioRepository.save(usuario);

            // Retorna senha gerada para o Saga (frontend)
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("senha", senhaGerada));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao criar usuário: " + e.getMessage()));
        }
    }

    // Método auxiliar local para gerar senha aleatória
    private String gerarSenhaAleatoria() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[8];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}

