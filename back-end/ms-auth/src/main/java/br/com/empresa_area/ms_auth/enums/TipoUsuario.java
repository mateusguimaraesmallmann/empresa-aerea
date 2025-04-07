package br.com.empresa_area.ms_auth.enums;

public enum TipoUsuario {
    
    CLIENTE("cliente"),
    FUNCIONARIO("funcionario");

    private String role;

    TipoUsuario(String role){
        this.role = role;
    }

    public String getRole(){
        return role;
    }
    
}