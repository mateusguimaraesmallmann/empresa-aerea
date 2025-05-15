package br.com.empresa_aerea.saga.messaging;

public final class SagaMessaging {
    public static final String EXCHANGE = "saga-exchange";

    public static final String RPC_QUEUE_CLIENTE      = "rpc.cliente.fetch";
    public static final String RPC_QUEUE_FUNCIONARIO = "rpc.funcionario.fetch";

    public static final String CMD_CADASTRAR_CLIENTE       = "ms-cliente-cliente-cadastrar";
    public static final String CMD_CADASTRAR_FUNCIONARIO   = "ms-funcionario-funcionario-cadastrar";
    public static final String CMD_CADASTRAR_VOO           = "ms-voos-voo-cadastrar";
    public static final String CMD_CADASTRAR_RESERVA       = "ms-reserva-reserva-cadastrar";

    public static final String RPL_CADASTRO_CLIENTE        = "saga-ms-cliente-cliente-cadastrado-endpoint";
    public static final String RPL_CADASTRO_FUNCIONARIO    = "saga-ms-funcionario-funcionario-cadastrado-endpoint";
    public static final String RPL_CADASTRO_VOO            = "saga-ms-voos-voo-cadastrado-endpoint";
    public static final String RPL_CADASTRO_RESERVA        = "saga-ms-reserva-reserva-cadastrado-endpoint";

    private SagaMessaging() {}
}