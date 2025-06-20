package br.com.empresa_area.ms_auth.services;

import br.com.empresa_area.ms_auth.dtos.LoginDTO;
import br.com.empresa_area.ms_auth.dtos.RegisterRequestDTO;
import br.com.empresa_area.ms_auth.dtos.RegisterResponseDTO;
import br.com.empresa_area.ms_auth.models.Usuario;
import br.com.empresa_area.ms_auth.repositories.UsuarioRepository;
import br.com.empresa_area.ms_auth.security.TokenService;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;

    public AuthorizationService(UsuarioRepository usuarioRepository,
                                TokenService tokenService,
                                PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        return User.builder()
                .username(usuario.getEmail())
                .password(usuario.getSenha())
                .roles(usuario.getTipo().toString())
                .build();
    }

    public Map<String, Object> login(LoginDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.getLogin())
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        if (!passwordEncoder.matches(dto.getSenha(), usuario.getSenha())) {
            throw new RuntimeException("Login ou senha inválidos");
        }

        String token = tokenService.generateToken(usuario);

        Map<String, Object> response = new HashMap<>();
        response.put("access_token", token);
        response.put("token_type", "bearer");
        response.put("tipo", usuario.getTipo().toString());
        response.put("usuario", usuario);

        return response;
    }

    public RegisterResponseDTO cadastrarLogin(RegisterRequestDTO dto) {
        if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("E-mail já cadastrado.");
        }

        Usuario novo = new Usuario();
        novo.setLogin(dto.getEmail());
        novo.setSenha(passwordEncoder.encode(gerarSenhaAleatoria()));
        novo.setRole(dto.getTipo());
        usuarioRepository.save(novo);
        
        return new RegisterResponseDTO(novo.getEmail(), novo.getRole(), null);
    }

    private String gerarSenhaAleatoria() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[8];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
    
}