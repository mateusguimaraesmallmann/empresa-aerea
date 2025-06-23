package br.com.empresa_aerea.saga.configurations;

public final class SagaMessaging {

    public static final String EXCHANGE = "saga-exchange";

    //============================================================================  AUTOCADASTRO DE CLIENTE
    public static final String CMD_CADASTRAR_CLIENTE = "ms-cliente-cadastrar-cliente";
    public static final String CMD_CADASTRAR_LOGIN = "ms-auth-cadastrar-login";

    public static final String RPL_CADASTRAR_CLIENTE = "saga-ms-cliente-cadastrar-cliente";
    public static final String RPL_CADASTRAR_LOGIN = "saga-ms-auth-cadastrar-login";

    public static final String QUEUE_CADASTRAR_CLIENTE = CMD_CADASTRAR_CLIENTE;
    public static final String QUEUE_CADASTRAR_LOGIN = CMD_CADASTRAR_LOGIN;
    public static final String QUEUE_RPL_CADASTRAR_CLIENTE = RPL_CADASTRAR_CLIENTE;
    public static final String QUEUE_RPL_CADASTRAR_LOGIN = RPL_CADASTRAR_LOGIN;

    //============================================================================  LOGIN
    public static final String CMD_AUTH_LOGIN = "auth-login";
    public static final String CMD_AUTH_CLIENTE = "ms-cliente-auth";
    public static final String CMD_AUTH_FUNCIONARIO = "ms-funcionario-auth";

    public static final String RPL_AUTH_LOGIN = "saga-auth-login";
    public static final String RPL_AUTH_CLIENTE = "saga-ms-cliente-auth";
    public static final String RPL_AUTH_FUNCIONARIO = "saga-ms-funcionario-auth";

    public static final String QUEUE_AUTH_LOGIN = CMD_AUTH_LOGIN;
    public static final String QUEUE_AUTH_CLIENTE = CMD_AUTH_CLIENTE;
    public static final String QUEUE_AUTH_FUNCIONARIO = CMD_AUTH_FUNCIONARIO;
    public static final String QUEUE_RPL_AUTH_LOGIN = RPL_AUTH_LOGIN;
    public static final String QUEUE_RPL_AUTH_CLIENTE = RPL_AUTH_CLIENTE;
    public static final String QUEUE_RPL_AUTH_FUNCIONARIO = RPL_AUTH_FUNCIONARIO;
    
}