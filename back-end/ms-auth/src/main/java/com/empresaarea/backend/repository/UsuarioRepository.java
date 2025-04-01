package com.empresaarea.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import com.empresaarea.backend.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, String>{
    
    UserDetails findByLogin(String login);
}
