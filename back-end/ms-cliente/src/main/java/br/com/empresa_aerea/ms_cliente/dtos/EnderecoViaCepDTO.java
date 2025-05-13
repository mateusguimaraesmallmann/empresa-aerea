package br.com.empresa_aerea.ms_cliente.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EnderecoViaCepDTO {

    @JsonProperty("uf")
    private String uf;

    @JsonProperty("localidade")
    private String localidade;

    @JsonProperty("logradouro")
    private String logradouro;

    @JsonProperty("complemento")
    private String complemento;

   
    public String getUf() { return uf; }
    public String getLocalidade() { return localidade; }
    public String getLogradouro() { return logradouro; }
    public String getComplemento() { return complemento; }
}