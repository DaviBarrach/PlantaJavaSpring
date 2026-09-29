package com.planta.cadastro_planta.controller;

import com.planta.cadastro_planta.business.PlantaService;
import com.planta.cadastro_planta.infrastructure.entitys.Planta;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController //entende que é Controller
@RequestMapping("/planta") //mapear URL
@RequiredArgsConstructor //para não precisar criar o construtor
public class PlantaController {

    private final PlantaService plantaService; //para usar o CRUD

    @PostMapping
    //RequestBody exige um conteúdo preenchido
    //ResponseEntity é pra retornar respostas http
    public ResponseEntity<Void> salvarPlanta(@RequestBody Planta planta){
        plantaService.salvarPlanta(planta);
        return ResponseEntity.ok().build();
    }


}
