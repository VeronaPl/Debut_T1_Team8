package com.example.demo.Data;

import com.example.demo.BDData.Person;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PersonSumReq {


    private Long id;
    private String firstName;
    private String lastName;
    private String averageName;
    private String login;
    private String role;
    private Integer sum;
    public PersonSumReq(Person pers) {
        id = pers.getId();
        firstName = pers.getFirstName();
        lastName = pers.getLastName();
        averageName = pers.getAverageName();
        login = pers.getLogin();
        role = pers.getRole();
        sum = pers.getSum();
    }
}

