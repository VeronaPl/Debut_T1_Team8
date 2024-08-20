package com.example.demo.BDData;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "persons")
@Getter
@Setter
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "first_Name")
    private String firstName;
    @Column(name = "last_Name")
    private String lastName;
    @Column(name = "average_Name")
    private String averageName;
    @Column(name = "login")
    private String login;
    @Column(name = "password")
    private String password;
    @Column(name = "role")
    private String role;
    @Column(name = "sum")
    private Integer sum;

}

