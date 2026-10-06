package com.planta.cadastro_planta.business;

import com.planta.cadastro_planta.infrastructure.entitys.Planta;
import com.planta.cadastro_planta.infrastructure.repository.PlantaRepository;
import org.springframework.stereotype.Service;

@Service
public class PlantaService {

    //para usar os métodos SQL
    private final PlantaRepository repository;

    public PlantaService(PlantaRepository repository){
        this.repository = repository;
    }

    //aí coloca no Controller
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

    public void deleterPlantaPorClassificacao(String classificacao){
        repository.deleteByClassificacao(classificacao);
    }

    public void atualizarPlantaPorId(Integer id, Planta planta){
        //dados antigos
        Planta plantaEntity = repository.findById(id).orElseThrow(() -> new RuntimeException("Planta não encontrada"));

        //dados novos
        Planta plantaAtualizada = Planta.builder()
                .nome(planta.getNome() != null ? planta.getNome() : plantaEntity.getNome())
                .classificacao(planta.getClassificacao() != null ? planta.getClassificacao() : plantaEntity.getClassificacao())
                .porte(planta.getPorte() != null ? planta.getPorte() : plantaEntity.getPorte())
                .gostaAgua(planta.isGostaAgua() ? true : plantaEntity.isGostaAgua())
                .id(plantaEntity.getId())
                .build();

        repository.saveAndFlush(plantaAtualizada);
    }

}
