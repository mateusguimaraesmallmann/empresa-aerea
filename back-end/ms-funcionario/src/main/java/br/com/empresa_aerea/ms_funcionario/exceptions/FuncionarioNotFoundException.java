package br.com.empresa_aerea.ms_funcionario.exceptions;

public class FuncionarioNotFoundException extends RuntimeException {
    public FuncionarioNotFoundException(String cpf) {
        super("Funcionário com CPF " + cpf + " não encontrado.");
    }
}
