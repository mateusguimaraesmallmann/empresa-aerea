package br.com.empresa_aerea.ms_cliente.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class EnderecoViaCepDTO {

    @JsonProperty("logradouro")
    private String ruaNumero;

    @JsonProperty("complemento")
    private String complemento;

    @JsonProperty("localidade")
    private String cidade;

    @JsonProperty("uf")
    private String uf;
    
}