package br.com.empresa_aerea.ms_cliente.services;

import br.com.empresa_aerea.ms_cliente.models.Cliente;
import br.com.empresa_aerea.ms_cliente.models.TransacaoMilhas;
import br.com.empresa_aerea.ms_cliente.repositories.ClienteRepository;
import br.com.empresa_aerea.ms_cliente.repositories.TransacaoMilhasRepository;
import br.com.empresa_aerea.ms_cliente.exceptions.ClienteJaExisteException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private TransacaoMilhasRepository transacaoMilhasRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public Cliente salvar(Cliente cliente) throws ClienteJaExisteException {
        if (clienteRepository.findByCpf(cliente.getCpf()).isPresent() 
                || clienteRepository.findByEmail(cliente.getEmail()).isPresent()) {
            throw new ClienteJaExisteException("CPF ou e-mail já cadastrado.");
        }
        cliente.setMilhas(0);
        return clienteRepository.save(cliente);
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

    // Atualizar saldo de milhas e registra
    public Map<String, Object> atualizarMilhas(Long id, int quantidade) {
        Cliente cliente = clienteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Integer saldoAtual = cliente.getMilhas() != null ? cliente.getMilhas() : 0;
        cliente.setMilhas(saldoAtual + quantidade);
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
        response.put("saldo_milhas", cliente.getMilhas());
        return response;
    }

    // Extrato de milhas 
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
        response.put("saldo_milhas", cliente.getMilhas());
        response.put("transacoes", transacoes);
        return response;
    }
}
