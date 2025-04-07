package br.com.empresa_area.ms_auth.configurations;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.data.mongodb.core.query.Query;

import br.com.empresa_area.ms_auth.models.Usuario;
import br.com.empresa_area.ms_auth.enums.TipoUsuario;

@Configuration
public class InitMongoDB {

    @Bean
    CommandLineRunner initDatabase(MongoTemplate mongoTemplate, BCryptPasswordEncoder passwordEncoder) {
        
        return args -> {
            if (!mongoTemplate.collectionExists(Usuario.class)) {
                mongoTemplate.createCollection(Usuario.class);
            }

            Query query = new Query();
            long count = mongoTemplate.count(query, Usuario.class);
            if (count == 0) {
                String senha = "1234";
                
                List<Usuario> funcionarios = Arrays.asList(
                    "funcionario01", "funcionario02", "funcionario03"
                ).stream()
                 .map(nome -> new Usuario(null, nome + "@gmail.com", passwordEncoder.encode(senha), TipoUsuario.FUNCIONARIO))
                 .collect(Collectors.toList());

                 List<Usuario> clientes = Arrays.asList(
                    "Cliente01", "Cliente02", "Cliente03"
                ).stream()
                 .map(nome -> new Usuario(null, nome + "@gmail.com", passwordEncoder.encode(senha), TipoUsuario.CLIENTE))
                 .collect(Collectors.toList());

                mongoTemplate.insertAll(funcionarios);
                mongoTemplate.insertAll(clientes);
            }
        };
    }

}