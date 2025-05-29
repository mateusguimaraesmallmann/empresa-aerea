package br.com.empresa_aerea.ms_cliente.services;

import br.com.empresa_aerea.ms_cliente.models.Cliente;
import br.com.empresa_aerea.ms_cliente.models.Milha;
import br.com.empresa_aerea.ms_cliente.repositories.ClienteRepository;
import br.com.empresa_aerea.ms_cliente.repositories.MilhasRepository;
import br.com.empresa_aerea.ms_cliente.enums.TipoTransacaoEnum;
import br.com.empresa_aerea.ms_cliente.exceptions.ClienteJaExisteException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.*;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private MilhasRepository milhasRepository;

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

        Milha milha = new Milha();
        milha.setCliente(cliente);
        milha.setQuantidadeMilhas(Integer.parseInt(String.valueOf(quantidade)));
        milha.setTipoTransacao(TipoTransacaoEnum.ENTRADA);
        milha.setDescricao("COMPRA DE MILHAS");
        milha.setValorReais(null);
//        milha.setCodigoReserva(null);
        milha.setDataTransacao(OffsetDateTime.now());

        milhasRepository.save(milha);

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
        for (Milha t : milhasRepository.findByClienteIdCliente(cliente.getIdCliente()).get()) {
            Map<String, Object> item = new HashMap<>();
            item.put("quantidade_milhas", t.getQuantidadeMilhas());
            item.put("tipo", t.getTipoTransacao());
            transacoes.add(item);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("codigo", cliente.getIdCliente());
        response.put("saldo_milhas", cliente.getMilhas());
        response.put("transacoes", transacoes);
        return response;
    }
}
