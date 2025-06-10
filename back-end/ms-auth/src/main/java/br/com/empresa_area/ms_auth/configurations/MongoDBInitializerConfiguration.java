// package br.com.empresa_area.ms_auth.configurations;

// import br.com.empresa_area.ms_auth.enums.TipoUsuario;
// import br.com.empresa_area.ms_auth.models.Usuario;
// import br.com.empresa_area.ms_auth.repositories.UsuarioRepository;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.crypto.password.PasswordEncoder;

// import java.util.List;

// @Configuration
// public class MongoDBInitializerConfiguration {

//     @Bean
//     CommandLineRunner initDatabase(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
//         return args -> {

//             System.out.println("============================================================");
//             System.out.println("> limpando base de dados...");
//             usuarioRepository.deleteAll();
//             System.out.println("> banco zerado com sucesso!");
//             System.out.println("------------------------------------------------------------");

//             System.out.println("> criando usuário cliente...");
//             Usuario cliente = new Usuario(
//                 null,
//                 "cliente1@example.com",
//                 passwordEncoder.encode("123456"),
//                 TipoUsuario.CLIENTE
//             );

//             System.out.println("> criando usuario funcionário...");
//             Usuario funcionario = new Usuario(
//                 null,
//                 "funcionario1@example.com",
//                 passwordEncoder.encode("123456"),
//                 TipoUsuario.FUNCIONARIO
//             );

//             System.out.println("> salvando usuarios no banco...");
//             usuarioRepository.save(cliente);
//             usuarioRepository.save(funcionario);
//             System.out.println("> usuarios inseridos com sucesso!");
//             System.out.println("------------------------------------------------------------");

//             System.out.println("> buscando todos os usuarios no banco...");
//             List<Usuario> usuarios = usuarioRepository.findAll();

//             if (usuarios.isEmpty()) {
//                 System.out.println("> nenhum usuario encontrado.");
//             } else {
//                 System.out.println("> total de usuarios encontrados: " + usuarios.size());
//                 for (Usuario u : usuarios) {
//                     System.out.println("--------------------------------------------------");
//                     System.out.println("> id:     " + u.getId());
//                     System.out.println("> email:  " + u.getEmail());
//                     System.out.println("> senha:  " + u.getSenha());
//                     System.out.println("> tipo:   " + u.getTipo());
//                     System.out.println("--------------------------------------------------");
//                 }
//             }

//             System.out.println("> limpando banco novamente...");
//             usuarioRepository.deleteAll();
//             System.out.println("============================================================\n\n");

//             System.out.println("> rotina encerrada e ms pronto");
//         };
//     }
// }
