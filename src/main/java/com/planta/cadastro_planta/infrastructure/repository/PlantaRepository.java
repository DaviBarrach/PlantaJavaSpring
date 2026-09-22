package com.planta.cadastro_planta.infrastructure.repository;

import com.planta.cadastro_planta.infrastructure.entitys.Planta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

//Extends JPA porque já tem métodos do crud prontos
//O integer é o tipo da PK.
public interface PlantaRepository extends JpaRepository<Planta, Integer> {

    //personalizando o método, ele não existe no JPA
    Optional<Planta> findByClassificacao(String classificacao);


}
