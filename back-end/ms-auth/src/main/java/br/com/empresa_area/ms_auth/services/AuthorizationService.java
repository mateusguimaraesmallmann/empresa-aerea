package br.com.empresa_area.ms_auth.services;

import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
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

    private static final Logger logger = LoggerFactory.getLogger(AuthorizationService.class);

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

   
    public static class ClienteCriadoEvent {
        private String userId;
        private String cpf;
        private String nome;
        private String email;
        private String cep;

        public ClienteCriadoEvent(String userId, String cpf, String nome, String email, String cep) {
            this.userId = userId;
            this.cpf = cpf;
            this.nome = nome;
            this.email = email;
            this.cep = cep;
        }

      
        public String getUserId() { return userId; }
        public String getCpf() { return cpf; }
        public String getNome() { return nome; }
        public String getEmail() { return email; }
        public String getCep() { return cep; }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return usuarioRepository.findByLogin(username);
    }

    public TokenResponseDTO login(LoginDTO loginDTO) {              
        var authenticationToken = new UsernamePasswordAuthenticationToken(
            loginDTO.login(), 
            loginDTO.password()
        );
        Authentication authentication = manager.authenticate(authenticationToken);
        Usuario user = (Usuario) authentication.getPrincipal();

        var tokenJWT = tokenService.generateToken(user);
        Object perfil = fetchPerfil(user.getId(), user.getRole());

        return new TokenResponseDTO(tokenJWT, "bearer", user.getRole(), perfil);
    }

    public UserDTO register(RegisterDTO dto) {
        logger.info("Registrando usuário: {}", dto.email()); // Log antes do return

        String rawPwd = String.format("%04d", new Random().nextInt(10_000));
        String hash = passwordEncoder.encode(rawPwd);

        Usuario user = new Usuario(null, dto.email(), hash, TipoUsuario.CLIENTE);
        usuarioRepository.save(user);

        emailService.enviarEmail(dto.email(), rawPwd);

        // Publicar evento de criação de cliente
        ClienteCriadoEvent event = new ClienteCriadoEvent(
            user.getId(), dto.cpf(), dto.nome(), dto.email(), dto.cep()
        );
        rabbitTemplate.convertAndSend(
            RabbitMQConfiguration.EXCHANGE, 
            "cliente.criado", 
            event
        );

        return new UserDTO(user.getId(), dto.email(), user.getRole());
    }

    private Object fetchPerfil(String userId, TipoUsuario tipo) {
        UserFetchRequestDTO req = new UserFetchRequestDTO(userId);
        String fila = (tipo == TipoUsuario.CLIENTE) ? 
            RabbitMQConfiguration.RPC_QUEUE_CLIENTE : 
            RabbitMQConfiguration.RPC_QUEUE_FUNCIONARIO;
        
        Object resp = rabbitTemplate.convertSendAndReceive(fila, req);
        if (resp == null) {
            throw new IllegalStateException("Timeout buscando perfil de " + tipo);
        }
        return resp;
    }

    @RabbitListener(queues = "cliente.falha.queue")
    public void handleFalhaCliente(String userId) {
        usuarioRepository.deleteById(userId);
    }
}