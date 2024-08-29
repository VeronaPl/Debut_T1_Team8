package com.example.demo.DataReq;

import com.example.demo.BDData.CFO;
import com.example.demo.Service.ALLIDService;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JWTReq {

    private String token;

    public JWTReq(String token) {
        this.token = token;
    }
}



