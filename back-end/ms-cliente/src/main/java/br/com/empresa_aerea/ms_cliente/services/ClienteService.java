package br.com.empresa_aerea.ms_cliente.services;

import br.com.empresa_aerea.ms_cliente.models.Cliente;
import br.com.empresa_aerea.ms_cliente.models.TransacaoMilhas;
import br.com.empresa_aerea.ms_cliente.repositories.ClienteRepository;
import br.com.empresa_aerea.ms_cliente.repositories.TransacaoMilhasRepository;
import br.com.empresa_aerea.ms_cliente.dtos.ClienteCadastroResponseDTO;
import br.com.empresa_aerea.ms_cliente.dtos.ClienteDTO;
import br.com.empresa_aerea.ms_cliente.exceptions.ClienteJaExisteException;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ClienteService {

    private static final Logger logger = LoggerFactory.getLogger(ClienteService.class);

    @Autowired
    private ModelMapper mapper;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private TransacaoMilhasRepository transacaoMilhasRepository;

    public ClienteCadastroResponseDTO cadastrarCliente(ClienteDTO clienteDTO) throws Exception {
        Optional<Cliente> existClienteBD = clienteRepository.findByEmail(clienteDTO.getEmail());
        if (existClienteBD.isPresent()) {
            throw new ClienteJaExisteException("Outro cliente com email ja existente!");
        }

        try{
            Cliente cliente = mapper.map(clienteDTO, Cliente.class);
            Cliente clienteCriadoBD = clienteRepository.save(cliente);
            ClienteCadastroResponseDTO clienteResponseCadastrarDTO = mapper.map(clienteCriadoBD, ClienteCadastroResponseDTO.class);
            return clienteResponseCadastrarDTO;
        }catch(Exception ex){
            logger.error(ex.getMessage());
            throw new Exception("Internal Server Error");
        }       
    }

    public ClienteCadastroResponseDTO loginCliente(ClienteDTO clienteDTO) throws Exception{
        try {
            Optional<Cliente> clienteDB = clienteRepository.findByEmail(clienteDTO.getEmail());
            ClienteCadastroResponseDTO cliente = mapper.map(clienteDB, ClienteCadastroResponseDTO.class);
            return cliente;
        } catch (Exception ex) {
            logger.error(ex.getMessage());
            throw new Exception();
        }
    }

    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    public Optional<Cliente> buscarPorCpf(String cpf) {
        return clienteRepository.findByCpf(cpf);
    }

    public Optional<Cliente> buscarPorEmail(String email) {
        return clienteRepository.findByEmail(email);
    }

    public Map<String, Object> atualizarMilhas(Long id, int quantidade) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Integer saldoAtual = cliente.getSaldoMilhas() != null ? cliente.getSaldoMilhas() : 0;
        cliente.setSaldoMilhas(saldoAtual + quantidade);
        clienteRepository.save(cliente);

        TransacaoMilhas transacao = new TransacaoMilhas();
        transacao.setCliente(cliente);
        transacao.setQuantidade(quantidade);
        transacao.setTipo("ENTRADA");
        transacao.setDescricao("COMPRA DE MILHAS");
        transacao.setValorReais(null);
        transacao.setCodigoReserva(null);
        transacao.setDataHora(LocalDateTime.now());

        transacaoMilhasRepository.save(transacao);

        Map<String, Object> response = new HashMap<>();
        response.put("codigo", cliente.getIdCliente());
        response.put("saldo_milhas", cliente.getSaldoMilhas());
        return response;
    }

    public Map<String, Object> listarExtratoMilhas(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        List<Map<String, Object>> transacoes = new ArrayList<>();
        for (TransacaoMilhas t : transacaoMilhasRepository.findByClienteOrderByDataHoraDesc(cliente)) {
            Map<String, Object> item = new HashMap<>();
            item.put("quantidade_milhas", t.getQuantidade());
            item.put("tipo", t.getTipo());
            transacoes.add(item);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("codigo", cliente.getIdCliente());
        response.put("saldo_milhas", cliente.getSaldoMilhas());
        response.put("transacoes", transacoes);
        return response;
    }

}