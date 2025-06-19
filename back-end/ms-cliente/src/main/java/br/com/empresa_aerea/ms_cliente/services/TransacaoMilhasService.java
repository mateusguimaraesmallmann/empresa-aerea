package br.com.empresa_aerea.ms_cliente.services;

import br.com.empresa_aerea.ms_cliente.models.Cliente;
import br.com.empresa_aerea.ms_cliente.models.TransacaoMilhas;
import br.com.empresa_aerea.ms_cliente.repositories.TransacaoMilhasRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransacaoMilhasService {

    private static final Logger logger = LoggerFactory.getLogger(TransacaoMilhasService.class);

    private final TransacaoMilhasRepository transacaoMilhasRepository;

    public TransacaoMilhasService(TransacaoMilhasRepository transacaoMilhasRepository) {
        this.transacaoMilhasRepository = transacaoMilhasRepository;
    }

    /**
     * Registra uma compra de milhas para um cliente.
     *
     * @param cliente Cliente que está comprando milhas.
     * @param quantidade Quantidade de milhas compradas.
     * @param valorReais Valor total em reais da compra.
     * @param codigoReserva Código da reserva (opcional).
     */
    public void registrarCompra(Cliente cliente, int quantidade, double valorReais, String codigoReserva) {
        logger.info("Iniciando registro de compra de milhas para cliente ID: {}", cliente.getIdCliente());

        TransacaoMilhas transacao = new TransacaoMilhas();
        transacao.setCliente(cliente);
        transacao.setQuantidade(quantidade);
        transacao.setValorReais(valorReais);
        transacao.setDescricao("COMPRA DE MILHAS");
        transacao.setTipo("ENTRADA");
        transacao.setDataHora(LocalDateTime.now());
        transacao.setCodigoReserva(codigoReserva);

        transacaoMilhasRepository.save(transacao);

        logger.info("Compra de milhas registrada com sucesso. Cliente: {}, Milhas: {}, Valor: R${}",
                cliente.getIdCliente(), quantidade, valorReais);
    }

    /**
     * Lista o histórico de transações de milhas de um cliente.
     *
     * @param cliente Cliente a ser consultado.
     * @return Lista de transações ordenadas por data.
     */
    public List<TransacaoMilhas> listarPorCliente(Cliente cliente) {
        logger.debug("Buscando transações de milhas para cliente ID: {}", cliente.getIdCliente());
        List<TransacaoMilhas> transacoes = transacaoMilhasRepository.findByClienteOrderByDataHoraDesc(cliente);
        logger.debug("Total de transações encontradas: {}", transacoes.size());
        return transacoes;
    }
}
