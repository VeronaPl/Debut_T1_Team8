package com.example.demo.BDData;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "all_id")
@Getter
@Setter
public class ALLID {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "type_id")
    private String typeId;
    @Column(name = "table_id")
    private Long tableId;
}



