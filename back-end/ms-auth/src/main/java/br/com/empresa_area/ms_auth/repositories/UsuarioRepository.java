package br.com.empresa_area.ms_auth.repositories;

import br.com.empresa_area.ms_auth.models.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UsuarioRepository extends MongoRepository<Usuario, String> {
    
    Optional<Usuario> findByEmail(String email);
    
}
