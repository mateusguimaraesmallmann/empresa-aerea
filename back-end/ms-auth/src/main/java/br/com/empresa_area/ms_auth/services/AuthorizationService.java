package br.com.empresa_area.ms_auth.services;

import br.com.empresa_area.ms_auth.dtos.LoginDTO;
import br.com.empresa_area.ms_auth.dtos.RegisterRequestDTO;
import br.com.empresa_area.ms_auth.dtos.RegisterResponseDTO;
import br.com.empresa_area.ms_auth.models.Usuario;
import br.com.empresa_area.ms_auth.repositories.UsuarioRepository;
import br.com.empresa_area.ms_auth.security.TokenService;

import java.security.SecureRandom;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public Usuario login(LoginDTO dto) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(dto.getLogin(), dto.getSenha());
        authenticationManager.authenticate(usernamePassword);
        return usuarioRepository.findByEmail(dto.getLogin())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    }

    public RegisterResponseDTO cadastrarLogin(RegisterRequestDTO dto) {
        // Verifica se já existe usuário com o mesmo e-mail (login)
        if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("E-mail já cadastrado.");
        }

        Usuario novo = new Usuario();
        novo.setLogin(dto.getEmail() );
        novo.setSenha(passwordEncoder.encode(gerarSenhaAleatoria()));
        novo.setRole(dto.getTipo());
        usuarioRepository.save(novo);
        
        return new RegisterResponseDTO(novo.getEmail(), novo.getRole(), null);
    }

    // Método auxiliar local para gerar senha aleatória
    private String gerarSenhaAleatoria() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[8];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    public String generateToken(Usuario usuario) {
        return tokenService.generateToken(usuario);
    }
}