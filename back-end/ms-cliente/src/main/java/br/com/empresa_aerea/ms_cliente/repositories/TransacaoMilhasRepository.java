package br.com.empresa_aerea.ms_cliente.repositories;

import br.com.empresa_aerea.ms_cliente.models.Cliente;
import br.com.empresa_aerea.ms_cliente.models.TransacaoMilhas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

@Repository
public interface TransacaoMilhasRepository extends JpaRepository<TransacaoMilhas, Long> {

    List<TransacaoMilhas> findByClienteOrderByDataHoraDesc(Cliente cliente);

    List<TransacaoMilhas> findByClienteAndTipo(Cliente cliente, String tipo);

    List<TransacaoMilhas> findByClienteAndDataHoraBetween(Cliente cliente, LocalDateTime inicio, LocalDateTime fim);

    List<TransacaoMilhas> findByTipoOrderByDataHoraDesc(String tipo);

    Optional<TransacaoMilhas> findTopByClienteOrderByDataHoraDesc(Cliente cliente);

    boolean existsByClienteAndDescricaoContainingIgnoreCase(Cliente cliente, String descricao);

    long countByClienteAndTipo(Cliente cliente, String tipo);

    List<TransacaoMilhas> findByClienteAndDescricaoContainingIgnoreCase(Cliente cliente, String descricao);

    List<TransacaoMilhas> findTop10ByClienteOrderByDataHoraDesc(Cliente cliente);

    List<TransacaoMilhas> findTop5ByClienteAndTipoOrderByDataHoraDesc(Cliente cliente, String tipo);

    List<TransacaoMilhas> findByClienteAndValorReaisGreaterThan(Cliente cliente, Double valor);

    List<TransacaoMilhas> findByClienteAndCodigoReservaIsNotNull(Cliente cliente);

    List<TransacaoMilhas> findByClienteAndCodigoReserva(String cliente, String codigoReserva);

    List<TransacaoMilhas> findByClienteAndDataHoraAfter(Cliente cliente, LocalDateTime dataHora);

    List<TransacaoMilhas> findByClienteAndDataHoraBefore(Cliente cliente, LocalDateTime dataHora);

    List<TransacaoMilhas> findByClienteAndQuantidadeGreaterThan(Cliente cliente, Integer quantidade);

    List<TransacaoMilhas> findByClienteAndQuantidadeLessThan(Cliente cliente, Integer quantidade);

    List<TransacaoMilhas> findByClienteAndValorReaisBetween(Cliente cliente, Double minimo, Double maximo);

    List<TransacaoMilhas> findByClienteAndDataHora(LocalDateTime dataHora, Cliente cliente);

    List<TransacaoMilhas> findByClienteAndDescricao(String descricao, Cliente cliente);

    List<TransacaoMilhas> findByClienteAndCodigoReservaContaining(String codigo, Cliente cliente);

    List<TransacaoMilhas> findByClienteAndTipoAndDescricaoContaining(Cliente cliente, String tipo, String descricao);
}
