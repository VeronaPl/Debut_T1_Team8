package com.example.demo.DataReq;

import com.example.demo.BDData.CFO;
import com.example.demo.Service.ALLIDService;
import com.example.demo.Service.PersonService;
import lombok.Getter;
import lombok.Setter;

import java.text.SimpleDateFormat;

@Getter
@Setter
public class CFOSumReq {

    private Long id;
    private String cfoName;
    private Integer sum;
    private Integer basicSum;
    private String owner;
    private String finalDate;
    public CFOSumReq(CFO cfo, PersonService personService, ALLIDService allidService) {
        id = allidService.getALLId(cfo.getId(), "cfo");
        cfoName = cfo.getCfoName();
        sum = cfo.getSum();
        basicSum = cfo.getBasicSum();
        Long ownerId = cfo.getOwnerId();
        owner = personService.getById(ownerId) == null ? "Удаленный пользователь" : personService.getById(ownerId).getLogin();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        finalDate = formatter.format(cfo.getFinalDate());
    }
}



