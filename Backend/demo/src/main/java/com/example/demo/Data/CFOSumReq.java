package com.example.demo.Data;

import com.example.demo.BDData.CFO;
import com.example.demo.Service.PersonService;
import lombok.Getter;
import lombok.Setter;

import java.text.SimpleDateFormat;
import java.util.Date;

@Getter
@Setter
public class CFOSumReq {

    private Long id;
    private String cfoName;
    private Integer sum;
    private Integer basicSum;
    private Long ownerId;
    private String owner;
    private String finalDate;
    public CFOSumReq(CFO cfo, PersonService personService) {
        id = cfo.getId();
        cfoName = cfo.getCfoName();
        sum = cfo.getSum();
        basicSum = cfo.getBasicSum();
        ownerId = cfo.getOwnerId();
        owner = personService.getById(ownerId) == null ? "Удаленный пользователь" : personService.getById(ownerId).getLogin();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        finalDate = formatter.format(cfo.getFinalDate());
    }
}



