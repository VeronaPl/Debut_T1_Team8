package com.example.demo.RoutingDataReq;

import com.example.demo.BDData.Person;
import com.example.demo.DataReq.PersonSumReq;
import com.example.demo.Service.ALLIDService;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserObjectReq {

    private String type;
    private PersonSumReq personSumReq;

    public UserObjectReq(Person person, ALLIDService allidService ) {

        type = person.getRole();
        personSumReq = new PersonSumReq(person, allidService);

    }
}



