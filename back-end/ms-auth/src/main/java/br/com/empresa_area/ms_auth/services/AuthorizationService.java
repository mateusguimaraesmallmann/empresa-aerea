package br.com.empresa_area.ms_auth.services;

import br.com.empresa_area.ms_auth.dtos.AuthResponseDTO;
import br.com.empresa_area.ms_auth.dtos.LoginRequestDTO;
import br.com.empresa_area.ms_auth.dtos.RegisterRequestDTO;
import br.com.empresa_area.ms_auth.dtos.RegisterResponseDTO;
import br.com.empresa_area.ms_auth.models.Usuario;
import br.com.empresa_area.ms_auth.repositories.UsuarioRepository;
import br.com.empresa_area.ms_auth.security.TokenService;

import java.security.SecureRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService implements UserDetailsService {

    @Autowired 
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

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

    public AuthResponseDTO login(LoginRequestDTO loginRequestDTO) {
        Usuario usuario = usuarioRepository.findByEmail(loginRequestDTO.getLogin())
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        if (!passwordEncoder.matches(loginRequestDTO.getSenha(), usuario.getSenha())) {
            return new AuthResponseDTO(null, null, "Usuário ou senha incorretos!");
        }

        String token = tokenService.generateToken(usuario);
        AuthResponseDTO response = new AuthResponseDTO(usuario.getTipo(), token, null);
        return response;
    }

    public RegisterResponseDTO cadastrarLogin(RegisterRequestDTO dto) {
        if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("E-mail já cadastrado.");
        }

        String senhaGerada = gerarSenhaAleatoria();
        
        Usuario novo = new Usuario();
        novo.setLogin(dto.getEmail());
        novo.setSenha(passwordEncoder.encode(senhaGerada));
        novo.setRole(dto.getTipo());
        
        usuarioRepository.save(novo);

        //emailService.enviarEmail(novo.getLogin(), senhaGerada);
        
        return new RegisterResponseDTO(novo.getEmail(), novo.getRole(), null);
    }

    private String gerarSenhaAleatoria() {
        SecureRandom random = new SecureRandom();
        int numero = 1000 + random.nextInt(9000);
        return String.valueOf(numero);
    }
    
}