package br.com.empresa_aerea.saga.configurations;

public final class SagaMessaging {

    public static final String EXCHANGE = "saga-exchange";

    public static final String CMD_CADASTRAR_CLIENTE = "ms-cliente-cadastrar-cliente";
    public static final String CMD_CADASTRAR_LOGIN = "ms-auth-cadastrar-login";

    public static final String RPL_CADASTRAR_CLIENTE = "saga-ms-cliente-cadastrar-cliente";
    public static final String RPL_CADASTRAR_LOGIN = "saga-ms-auth-cadastrar-login";

    public static final String QUEUE_CADASTRAR_CLIENTE = CMD_CADASTRAR_CLIENTE;
    public static final String QUEUE_CADASTRAR_LOGIN = CMD_CADASTRAR_LOGIN;
    public static final String QUEUE_RPL_CADASTRAR_CLIENTE = RPL_CADASTRAR_CLIENTE;
    public static final String QUEUE_RPL_CADASTRAR_LOGIN = RPL_CADASTRAR_LOGIN;
    
}