package br.com.empresa_aerea.ms_cliente.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import br.com.empresa_aerea.ms_cliente.dtos.EnderecoViaCepDTO;
import br.com.empresa_aerea.ms_cliente.models.Endereco;

@Service
public class ViaCepService {

    @Value("${viacep.url}")
    private String viaCepUrl;

    public Endereco buscarEndereco(String cep) {
        String url = viaCepUrl + cep + "/json/";
        RestTemplate restTemplate = new RestTemplate();
        EnderecoViaCepDTO response = restTemplate.getForObject(url, EnderecoViaCepDTO.class);
        
        return new Endereco(
            null, 
            cep, 
            response.getUf(), 
            response.getLocalidade(), 
            "", 
            response.getLogradouro(), 
            "", 
            response.getComplemento());
    }
}