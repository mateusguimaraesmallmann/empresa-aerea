package br.com.empresa_area.ms_auth.configurations;

import br.com.empresa_area.ms_auth.enums.TipoUsuario;
import br.com.empresa_area.ms_auth.models.Usuario;
import br.com.empresa_area.ms_auth.repositories.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class MongoDBInitializerConfiguration {

    @Bean
    CommandLineRunner initDatabase(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) { 
        
        return args -> {

            usuarioRepository.deleteAll();

            Usuario cliente = new Usuario(
                null,
                "cliente@teste.com",
                passwordEncoder.encode("1234"),
                TipoUsuario.CLIENTE
            );

            Usuario funcionario = new Usuario(
                null,
                "func_pre@gmail.com",
                passwordEncoder.encode("TADS"),
                TipoUsuario.FUNCIONARIO
            );

            usuarioRepository.save(cliente);
            usuarioRepository.save(funcionario);
        };
    }
}
