package com.example.demo.DataReq;

import com.example.demo.BDData.CFO;
import com.example.demo.Service.ALLIDService;
import lombok.Getter;
import lombok.Setter;
import org.eclipse.persistence.jpa.jpql.parser.DateTime;
import org.springframework.beans.factory.annotation.Value;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;

import java.util.Date;

@Getter
@Setter
public class JWTReq {
    private String token;
    private String creationTime;
    private long millisecondsPeriod;

    public JWTReq(String token, long jwtExpiration) {
        this.token = token;
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        creationTime = formatter.format(new Date());
        millisecondsPeriod = jwtExpiration;
    }
}



