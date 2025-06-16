package br.com.empresa_aerea.ms_funcionario.services;

import br.com.empresa_aerea.ms_funcionario.dtos.FuncionarioDTO;
import br.com.empresa_aerea.ms_funcionario.exceptions.FuncionarioNotFoundException;
import br.com.empresa_aerea.ms_funcionario.models.Funcionario;
import br.com.empresa_aerea.ms_funcionario.repositories.FuncionarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Random;

@Service
@Transactional
public class FuncionarioService {

    private static final Logger logger = LoggerFactory.getLogger(FuncionarioService.class);

    private final FuncionarioRepository funcionarioRepository;
    private final RabbitTemplate rabbitTemplate;
    //private final String filaFuncionario;

//    public FuncionarioService(FuncionarioRepository funcionarioRepository, RabbitTemplate rabbitTemplate, @Value("${app.mq.fila-funcionarios}") String filaFuncionario) {
    public FuncionarioService(FuncionarioRepository funcionarioRepository, RabbitTemplate rabbitTemplate) {
        this.funcionarioRepository = funcionarioRepository;
        this.rabbitTemplate = rabbitTemplate;
        //this.filaFuncionario = filaFuncionario;
    }

    public Funcionario salvar(@Valid FuncionarioDTO dto) {
        // 1) verifica duplicidade de CPF
        if (funcionarioRepository.existsByCpf(dto.getCpf())) {
            logger.warn("Tentativa de cadastro com CPF já existente: {}", dto.getCpf());
            throw new IllegalArgumentException("CPF já cadastrado: " + dto.getCpf());
        }

        // 2) gera senha e instancia o modelo (ID gerado pelo JPA)
        String senha = String.format("%04d", new Random().nextInt(10000));
        Funcionario funcionario = new Funcionario(
            dto.getCpf(),
            dto.getEmail(),
            dto.getNome(),
            dto.getTelefone()
        );
        funcionario.setAtivo(true);
        funcionario.setSenha(senha);

        // 3) salva no banco
        Funcionario salvo = funcionarioRepository.save(funcionario);
        logger.info("Funcionário cadastrado: {} (CPF {})", salvo.getNome(), salvo.getCpf());

        // 4) envia evento de envio de e-mail via RabbitMQ
        String msg = String.format("Funcionário %s cadastrado. Senha: %s", salvo.getNome(), senha);
        //rabbitTemplate.convertAndSend(filaFuncionario, msg);
        //logger.debug("Publicado na fila {}: {}", filaFuncionario, msg);

        return salvo;
    }

    @Transactional(readOnly = true)
    public List<Funcionario> listarTodos() {
        return funcionarioRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Funcionario buscarPorCpf(String cpf) {
        return funcionarioRepository.findByCpf(cpf)
            .orElseThrow(() -> new FuncionarioNotFoundException(cpf));
    }

    public Funcionario atualizar(String cpf, @Valid FuncionarioDTO dto) {
        Funcionario existente = funcionarioRepository.findByCpf(cpf)
            .orElseThrow(() -> new FuncionarioNotFoundException(cpf));

        existente.setNome(dto.getNome());
        existente.setEmail(dto.getEmail());
        existente.setTelefone(dto.getTelefone());

        Funcionario atualizado = funcionarioRepository.save(existente);
        logger.info("Funcionário atualizado: {} (CPF {})", atualizado.getNome(), cpf);
        return atualizado;
    }

    public void inativar(String cpf) {
        Funcionario func = funcionarioRepository.findByCpf(cpf)
            .orElseThrow(() -> new FuncionarioNotFoundException(cpf));
        func.setAtivo(false);
        funcionarioRepository.save(func);
        logger.info("Funcionário inativado: {} (CPF {})", func.getNome(), cpf);
    }

    public void remover(String cpf) {
        Funcionario func = funcionarioRepository.findByCpf(cpf)
            .orElseThrow(() -> new FuncionarioNotFoundException(cpf));
        funcionarioRepository.delete(func);
        logger.info("Funcionário removido fisicamente: {} (CPF {})", func.getNome(), cpf);
    }
}
