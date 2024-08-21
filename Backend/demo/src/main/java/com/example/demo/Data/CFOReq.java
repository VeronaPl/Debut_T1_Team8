package com.example.demo.Data;

import com.example.demo.BDData.CFO;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CFOReq {

    private Long id;
    private String cfoName;

    public CFOReq(CFO cfo) {
        id = cfo.getId();
        cfoName = cfo.getCfoName();
    }
}



