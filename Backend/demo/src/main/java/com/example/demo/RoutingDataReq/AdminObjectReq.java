package com.example.demo.RoutingDataReq;

import com.example.demo.BDData.ALLID;
import com.example.demo.BDData.CFO;
import com.example.demo.BDData.Person;
import com.example.demo.DataReq.CFOSumReq;
import com.example.demo.DataReq.PersonReq;
import com.example.demo.Service.ALLIDService;
import com.example.demo.Service.PersonService;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

@Getter
@Setter
public class AdminObjectReq {

    private String type;
    private CFOSumReq cfoSumReq;
    private PersonReq personReq;

    public AdminObjectReq(ALLID obj, CFO cfo, Person person, ALLIDService allidService, PersonService personService) {
        type = "person";
        if (obj != null)
            type = obj.getTypeId();
        if (cfo != null)
            cfoSumReq = new CFOSumReq(cfo, personService, allidService);
        if (person != null)
            personReq = new PersonReq(person, allidService);
        if (Objects.equals(type, "person"))
            type = person.getRole();
    }
}



