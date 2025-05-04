package br.com.empresa_area.ms_auth.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import br.com.empresa_area.ms_auth.models.Usuario;

@Repository
public interface  UsuarioRepository extends MongoRepository<Usuario, String>{

    UserDetails findByLogin(String login);
    
}
