package com.example.demo.BDData;

import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "transactions")
@Getter
@Setter
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "t_from")
    private Long tFrom;
    @Column(name = "t_to")
    private Long tTo;
    @Column(name = "owner")
    private Long owner;
    @Column(name = "sum")
    private Integer sum;
    @Column(name = "type")
    private String type;
    @Column(name = "comment")
    private String comment;
    @Column(name = "datatime")
    private Date datatime;

}




