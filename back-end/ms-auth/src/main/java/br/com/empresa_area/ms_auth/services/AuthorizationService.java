package br.com.empresa_area.ms_auth.services;

import java.util.Random;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.empresa_area.ms_auth.configurations.RabbitMQConfiguration;
import br.com.empresa_area.ms_auth.dtos.LoginDTO;
import br.com.empresa_area.ms_auth.dtos.RegisterDTO;
import br.com.empresa_area.ms_auth.dtos.TokenResponseDTO;
import br.com.empresa_area.ms_auth.dtos.UserDTO;
import br.com.empresa_area.ms_auth.dtos.UserFetchRequestDTO;
import br.com.empresa_area.ms_auth.enums.TipoUsuario;
import br.com.empresa_area.ms_auth.models.Usuario;
import br.com.empresa_area.ms_auth.repositories.UsuarioRepository;
import br.com.empresa_area.ms_auth.security.TokenService;

@Service
public class AuthorizationService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return usuarioRepository.findByLogin(username);
    }

    public TokenResponseDTO login(LoginDTO loginDTO) {              
        var authenticationToken = new UsernamePasswordAuthenticationToken(loginDTO.login() , loginDTO.password());
        var authentication = this.manager.authenticate(authenticationToken);
        
        Usuario user = (Usuario)authentication.getPrincipal();
        var tokenJWT = tokenService.generateToken(user);

        Object perfil = fetchPerfil(user.getId(), user.getRole());
        return new TokenResponseDTO(tokenJWT, "bearer", user.getRole(), perfil);
    }

    public UserDTO register(RegisterDTO dto) {

        String rawPwd = String.format("%04d", new Random().nextInt(10_000));
        String hash = passwordEncoder.encode(rawPwd);

        Usuario user = new Usuario(null, dto.email(), hash, TipoUsuario.CLIENTE);
        usuarioRepository.save(user);

        //enviar e‑mail
        emailService.enviarEmail(dto.email(), rawPwd);
        return new UserDTO(user.getId(), dto.email(), user.getRole());
    }

    private Object fetchPerfil(String userId, TipoUsuario tipo) {

        UserFetchRequestDTO req = new UserFetchRequestDTO(userId);
        String fila = (tipo == TipoUsuario.CLIENTE)? RabbitMQConfiguration.RPC_QUEUE_CLIENTE : RabbitMQConfiguration.RPC_QUEUE_FUNCIONARIO;
        Object resp = rabbitTemplate.convertSendAndReceive(fila, req);
        if (resp == null) {
            throw new IllegalStateException("Timeout buscando perfil de " + tipo);
        }
        return resp;
    }
    
}