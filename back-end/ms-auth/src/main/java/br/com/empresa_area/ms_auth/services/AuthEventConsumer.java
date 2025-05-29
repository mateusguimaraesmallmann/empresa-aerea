package br.com.empresa_area.ms_auth.services;

import br.com.empresa_area.ms_auth.dtos.UsuarioCriadoEvent;
import br.com.empresa_area.ms_auth.models.Usuario;
import br.com.empresa_area.ms_auth.repositories.UsuarioRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthEventConsumer {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public AuthEventConsumer(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @RabbitListener(queues = "usuario.criar")
    public void handleUsuarioCriado(UsuarioCriadoEvent event) {
        if (usuarioRepository.existsByEmail(event.getEmail())) {
            return;
        }

        Usuario usuario = new Usuario();
        usuario.setLogin(event.getEmail());
        usuario.setSenha(passwordEncoder.encode(event.getSenha()));
        usuario.setTipo(event.getTipo());

        usuarioRepository.save(usuario);
        emailService.enviarEmailComSenha(event.getEmail(), event.getSenha());
    }
}

