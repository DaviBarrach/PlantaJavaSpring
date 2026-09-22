package com.planta.cadastro_planta.infrastructure.entitys;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "planta")
@Entity
public class Planta {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name = "nome") //nome da coluna na tabela do banco
    private String nome; //nome do atributo que vai representá-la

    @Column(name = "classificacao")
    private String classificacao;

    @Column(name = "porte")
    private String porte;

    @Column(name = "gosta_agua")
    private boolean gostaAgua;





}
