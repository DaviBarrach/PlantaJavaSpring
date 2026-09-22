package com.planta.cadastro_planta.business;

import com.planta.cadastro_planta.infrastructure.entitys.Planta;
import com.planta.cadastro_planta.infrastructure.repository.PlantaRepository;
import org.springframework.stereotype.Service;

@Service
public class PlantaService {

    private final PlantaRepository repository;

    public PlantaService(PlantaRepository repository){
        this.repository = repository;
    }

    public void salvarPlanta(Planta planta){
        repository.saveAndFlush(planta);
    }

    /*método personalizado, não está dentro do JPA, então precisa ir na interface personalizá-lo */
    public Planta buscarPlantaPorClassificacao(String classificacao){

        //orElseThrow é pra tratar a exceção (porque colocamos optional)
        return repository.findByClassificacao(classificacao).orElseThrow(
                ()-> new RuntimeException("Classificacao não encontrada")
        );
    }



}
