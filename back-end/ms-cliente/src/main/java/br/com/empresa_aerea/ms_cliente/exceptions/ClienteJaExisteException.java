package br.com.empresa_aerea.ms_cliente.exceptions;

public class ClienteJaExisteException extends Exception {

    public ClienteJaExisteException(String errorMessage) {
        super(errorMessage);
    }
    
}
