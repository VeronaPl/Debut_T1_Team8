package com.example.demo.BDData;

import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "cfoes")
@Getter
@Setter
public class CFO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "cfo_name")
    private String cfoName;
    @Column(name = "sum")
    private Integer sum;
    @Column(name = "basic_sum")
    private Integer basicSum;
    @Column(name = "owner_id")
    private Long ownerId;
    @Column(name = "final_date")
    private Date finalDate;
}



