package com.example.demo.DataReq;

import com.example.demo.BDData.Person;
import com.example.demo.Service.ALLIDService;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PersonReq {


    private Long id;
    private String firstName;
    private String lastName;
    private String averageName;
    private String login;
    private String role;

    public PersonReq(Person pers, ALLIDService allidService) {
        id = allidService.getALLId(pers.getId(), "person");
        firstName = pers.getFirstName();
        lastName = pers.getLastName();
        averageName = pers.getAverageName();
        login = pers.getLogin();
        role = pers.getRole();
    }
}

