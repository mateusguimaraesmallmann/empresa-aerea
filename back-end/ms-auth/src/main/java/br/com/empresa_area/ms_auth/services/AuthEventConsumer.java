package br.com.empresa_area.ms_auth.services;

import br.com.empresa_area.ms_auth.dtos.UsuarioCriadoEvent;
import br.com.empresa_area.ms_auth.enums.TipoUsuario;
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
        // Evita duplicidade de e-mail
        if (usuarioRepository.existsByEmail(event.getEmail())) {
            return;
        }

        Usuario usuario = new Usuario();
        usuario.setEmail(event.getEmail());
        usuario.setSenha(passwordEncoder.encode(event.getSenha()));

        try {
            // Converte o tipo recebido como String para o enum
            usuario.setTipo(TipoUsuario.valueOf(event.getTipo().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Tipo de usuário inválido recebido: " + event.getTipo(), e);
        }

        usuarioRepository.save(usuario);

        // Envia e-mail com a senha gerada
        emailService.enviarEmailComSenha(event.getEmail(), event.getSenha());
    }
}

