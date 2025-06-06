package br.com.empresa_aerea.ms_funcionario.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(FuncionarioNotFoundException.class)
    public ResponseEntity<String> handleFuncionarioNotFound(FuncionarioNotFoundException ex) {
        return ResponseEntity.status(404).body(ex.getMessage());
    }
}
