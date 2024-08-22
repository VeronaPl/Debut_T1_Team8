package com.example.demo.DataReq;

import com.example.demo.BDData.CFO;
import com.example.demo.Service.ALLIDService;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CFOReq {

    private Long id;
    private String cfoName;

    public CFOReq(CFO cfo, ALLIDService allidService) {
        id = allidService.getALLId(cfo.getId(), "cfo");
        cfoName = cfo.getCfoName();
    }
}



