package com.planta.cadastro_planta.controller;

import com.planta.cadastro_planta.business.PlantaService;
import com.planta.cadastro_planta.infrastructure.entitys.Planta;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController //entende que é Controller
@RequestMapping("/planta") //mapear URL
@RequiredArgsConstructor //para não precisar criar o construtor
public class PlantaController {

    //obs: cada verbo http (esses @) é uma ação do crud

    private final PlantaService plantaService; //para usar o CRUD

    //esses daqui são métodos do service desenvolvidos
    @PostMapping
    //RequestBody exige um conteúdo preenchido
    //RequestParam exige apenas um parametro
    //ResponseEntity é pra retornar respostas http (500,200...)
    public ResponseEntity<Void> salvarPlanta(@RequestBody Planta planta){
        plantaService.salvarPlanta(planta);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<Planta> buscarPlantaPorClassificacao(@RequestParam String classificacao){
        return ResponseEntity.ok(plantaService.buscarPlantaPorClassificacao(classificacao));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleterPlantaPorClassificacao(@RequestParam String classificacao){
        plantaService.deleterPlantaPorClassificacao(classificacao);
        return ResponseEntity.ok().build();
    }

    //precisa usar put porque atualiza ele por completo, há outro verbo http que é só para atualizar partes
    @PutMapping
    public ResponseEntity<Void> atualizarPlantaPorId(@RequestBody Planta planta, @RequestParam Integer id){
        plantaService.atualizarPlantaPorId(id, planta);
        return ResponseEntity.ok().build();
    }

}
