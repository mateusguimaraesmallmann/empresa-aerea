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

    //============================================================================  CADASTRAR FUNCIONARIO
    public static final String CMD_CADASTRAR_FUNCIONARIO = "ms-funcionario-cadastrar-funcionario";

    public static final String RPL_CADASTRAR_FUNCIONARIO = "saga-ms-funcionario-cadastrar-funcionario";

    public static final String QUEUE_CADASTRAR_FUNCIONARIO = CMD_CADASTRAR_FUNCIONARIO;
    public static final String QUEUE_RPL_CADASTRAR_FUNCIONARIO = RPL_CADASTRAR_FUNCIONARIO;

    //============================================================================  EDITAR FUNCIONARIO
    public static final String CMD_ALTERAR_LOGIN = "ms-auth-alterar-login";
    public static final String CMD_ALTERAR_FUNCIONARIO = "ms-funcionario-alterar-funcionario";
    public static final String CMD_CONSULTAR_FUNCIONARIO = "ms-funcionario-consultar-funcionario";
    
    public static final String RPL_ALTERAR_LOGIN = "saga-ms-auth-alterar-login";
    public static final String RPL_CONSULTAR_FUNCIONARIO = "saga-ms-funcionario-consultar-funcionario";
    public static final String RPL_ALTERAR_FUNCIONARIO = "saga-ms-funcionario-alterar-funcionario";    

    public static final String QUEUE_ALTERAR_FUNCIONARIO = CMD_ALTERAR_FUNCIONARIO;
    public static final String QUEUE_RPL_ALTERAR_FUNCIONARIO = RPL_ALTERAR_FUNCIONARIO;

    public static final String QUEUE_CONSULTAR_FUNCIONARIO = CMD_CONSULTAR_FUNCIONARIO;
    public static final String QUEUE_RPL_CONSULTAR_FUNCIONARIO = RPL_CONSULTAR_FUNCIONARIO;

    public static final String QUEUE_ALTERAR_LOGIN = CMD_ALTERAR_LOGIN;
    public static final String QUEUE_RPL_ALTERAR_LOGIN = RPL_ALTERAR_LOGIN;
    
}