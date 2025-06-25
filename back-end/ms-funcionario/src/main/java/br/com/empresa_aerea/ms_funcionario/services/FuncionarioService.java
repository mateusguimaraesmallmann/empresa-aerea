package br.com.empresa_aerea.ms_funcionario.services;

import br.com.empresa_aerea.ms_funcionario.dtos.FuncionarioDTO;
import br.com.empresa_aerea.ms_funcionario.dtos.FuncionarioListDTO;
import br.com.empresa_aerea.ms_funcionario.dtos.FuncionarioResponseDTO;
import br.com.empresa_aerea.ms_funcionario.models.Funcionario;
import br.com.empresa_aerea.ms_funcionario.repositories.FuncionarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FuncionarioService {

    private static final Logger logger = LoggerFactory.getLogger(FuncionarioService.class);

    @Autowired
    private ModelMapper mapper;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    public FuncionarioResponseDTO loginFuncionario(FuncionarioDTO funcionarioDTO) throws Exception {
        
        try {
            Optional<Funcionario> funcionarioDB = funcionarioRepository.findByEmail(funcionarioDTO.getEmail());
            FuncionarioResponseDTO funcionario = mapper.map(funcionarioDB, FuncionarioResponseDTO.class);
            return funcionario;
        } catch (Exception ex) {
            logger.error(ex.getMessage());
            throw new Exception();
        }
    }

    public List<FuncionarioListDTO> listarTodos() throws Exception {
        try {
            List<Funcionario> list = funcionarioRepository.findAll();
            if (list.isEmpty()) {
                throw new Exception("Lista de funcionários vazia");
            }

            return list.stream()
                    .map(func -> {
                        FuncionarioListDTO dto = mapper.map(func, FuncionarioListDTO.class);
                        dto.setCodigo(func.getIdFuncionario());
                        dto.setTipo("FUNCIONARIO");
                        return dto;
                    }).collect(Collectors.toList());
        } catch (Exception e) {
            throw new Exception("Erro ao recuperar lista de funcionários!");
        }
    }

    public FuncionarioDTO buscarPorCodigo(String codigo) throws Exception {
        try {
            Long id = Long.valueOf(codigo);

            Funcionario funcionario = funcionarioRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Funcionário não encontrado com o código: " + codigo));

            FuncionarioDTO dto = mapper.map(funcionario, FuncionarioDTO.class);
            return dto;
        } catch (Exception e) {
            throw new Exception("Erro ao recuperar funcionário!");
        }
    }

    public FuncionarioResponseDTO cadastrarFuncionario(FuncionarioDTO dto){
        if (funcionarioRepository.existsByEmail(dto.getEmail())) {
            logger.warn("Tentativa de cadastro com E-mail já existente: {}", dto.getEmail());
            throw new IllegalArgumentException("E-mail já cadastrado: " + dto.getEmail());
        }

        if (funcionarioRepository.existsByCpf(dto.getCpf())) {
            logger.warn("Tentativa de cadastro com CPF já existente: {}", dto.getCpf());
            throw new IllegalArgumentException("CPF já cadastrado: " + dto.getCpf());
        }

        Funcionario funcionario = new Funcionario(
            null, dto.getCpf(), dto.getEmail(), dto.getNome(), dto.getTelefone(), dto.isAtivo());
        Funcionario funcDB = funcionarioRepository.save(funcionario);

        FuncionarioResponseDTO response = new FuncionarioResponseDTO(
            funcDB.getIdFuncionario(), funcDB.getCpf(), funcDB.getNome(), funcDB.getEmail(), funcDB.getTelefone(), funcDB.isAtivo(), null);
        
        return response;
    }

    /*public Funcionario salvar(@Valid FuncionarioDTO dto) {

        // 4) envia evento de envio de e-mail via RabbitMQ
        String msg = String.format("Funcionário %s cadastrado. Senha: %s", salvo.getNome(), senha);
        rabbitTemplate.convertAndSend(filaFuncionario, msg);
        logger.debug("Publicado na fila {}: {}", filaFuncionario, msg);

        return salvo;
    }

    @Transactional(readOnly = true)
    public Funcionario buscarPorCpf(String cpf) {
        return funcionarioRepository.findByCpf(cpf)
            .orElseThrow(() -> new FuncionarioNotFoundException(cpf));
    }

    public Funcionario atualizar(String cpf, @Valid FuncionarioDTO dto) {
        Funcionario existente = funcionarioRepository.findByCpf(cpf.trim())
            .orElseThrow(() -> new FuncionarioNotFoundException(cpf));
    
        // Atualiza somente os campos permitidos
        existente.setNome(dto.getNome());
        existente.setEmail(dto.getEmail());
        existente.setTelefone(dto.getTelefone());
        existente.setAtivo(dto.isAtivo());
    
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

    public Funcionario alterarStatus(String cpf, boolean ativo) {
        Funcionario funcionario = funcionarioRepository.findByCpf(cpf)
            .orElseThrow(() -> new FuncionarioNotFoundException("Funcionário não encontrado"));
        funcionario.setAtivo(ativo);
        return funcionarioRepository.save(funcionario);
    }*/

}