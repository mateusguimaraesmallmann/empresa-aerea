package br.com.empresa_aerea.ms_cliente.messaging;

public final class SagaMessaging {
    public static final String EXCHANGE = "saga-exchange";
    public static final String CMD_CADASTRAR_CLIENTE = "ms-cliente-cliente-cadastrar";
    public static final String RPL_CADASTRO_CLIENTE = "saga-ms-cliente-cliente-cadastrado-endpoint";

    private SagaMessaging() {}
}
