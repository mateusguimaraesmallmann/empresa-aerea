package br.com.empresa_area.ms_auth.configurations;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;

import br.com.empresa_area.ms_auth.enums.TipoUsuario;
import br.com.empresa_area.ms_auth.models.Usuario;

@Configuration
public class MongoDBInitializerConfigurations {

    @Bean
    CommandLineRunner initMongoDBDatabase(MongoTemplate mongoTemplate, BCryptPasswordEncoder passwordEncoder) {
        return args -> {
            if (!mongoTemplate.collectionExists(Usuario.class)) {
                mongoTemplate.createCollection(Usuario.class);
            }

            long count = mongoTemplate.count(new Query(), Usuario.class);
            if (count == 0) {

                List<Usuario> funcionarios = Arrays.asList(
                    "funcionario01"
                ).stream()
                 .map(nome -> new Usuario(null, nome + "@gmail.com", passwordEncoder.encode("TADS"), TipoUsuario.FUNCIONARIO))
                 .collect(Collectors.toList());

                List<Usuario> clientes = Arrays.asList(
                    "Cliente01"
                ).stream()
                 .map(nome -> new Usuario(null, nome + "@gmail.com", passwordEncoder.encode("TADS"), TipoUsuario.CLIENTE))
                 .collect(Collectors.toList());

                mongoTemplate.insertAll(funcionarios);
                mongoTemplate.insertAll(clientes);
            }
        };
    }

}