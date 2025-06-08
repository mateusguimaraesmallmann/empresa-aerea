package br.com.empresa_area.ms_auth.services;

import br.com.empresa_area.ms_auth.dtos.LoginDTO;
import br.com.empresa_area.ms_auth.dtos.RegisterDTO;
import br.com.empresa_area.ms_auth.models.Usuario;
import br.com.empresa_area.ms_auth.repositories.UsuarioRepository;
import br.com.empresa_area.ms_auth.security.TokenService;
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

    public Usuario register(RegisterDTO dto) {
        // Verifica se já existe usuário com o mesmo e-mail (login)
        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new RuntimeException("E-mail já cadastrado.");
        }

        Usuario novo = new Usuario();
        novo.setLogin(dto.email());
        novo.setSenha(passwordEncoder.encode(dto.senha()));
        novo.setRole(dto.tipo());
        return usuarioRepository.save(novo);
    }

    public Usuario login(LoginDTO dto) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(dto.getLogin(), dto.getSenha());
        authenticationManager.authenticate(usernamePassword);
        return usuarioRepository.findByEmail(dto.getLogin())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    }

    public String generateToken(Usuario usuario) {
        return tokenService.generateToken(usuario);
    }
}
