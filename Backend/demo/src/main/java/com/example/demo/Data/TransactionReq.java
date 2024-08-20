package com.example.demo.Data;

import com.example.demo.BDData.Transaction;
import com.example.demo.Service.CFOService;
import com.example.demo.Service.PersonService;
import lombok.Getter;
import lombok.Setter;

import java.text.SimpleDateFormat;
import java.util.Date;

@Getter
@Setter
public class TransactionReq {
    private Long id;
    private Long tFrom;
    private String from;
    private Long tTo;
    private String to;
    private Long owner;
    private Integer sum;
    private String type;
    private String comment;
    private String datatime;

    public TransactionReq(Transaction tran, CFOService cfoService, PersonService personService) {
        id = tran.getId();
        tFrom = tran.getTFrom();
        tTo = tran.getTTo();
        owner = tran.getOwner();
        sum = tran.getSum();
        type = tran.getType();
        comment = tran.getComment();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        datatime = formatter.format(tran.getDatatime());
        switch (type) {
            case  ("adminToCFO"):
                from = "Система";
                to = cfoService.getById(tTo) == null ? "Удаленный ЦФО" : cfoService.getById(tTo).getCfoName();
                break;
            case  ("adminToPerson"):
                from = "Система";
                to = personService.getById(tTo) == null ? "Удаленный пользователь" : personService.getById(tTo).getLogin();
                break;
            case  ("cfoToCFO"):
                from = cfoService.getById(tFrom) == null ? "Удаленный ЦФО" : cfoService.getById(tFrom).getCfoName();
                to = cfoService.getById(tTo) == null ? "Удаленный ЦФО" : cfoService.getById(tTo).getCfoName();
                break;
            case  ("cfoToPerson"):
                from = cfoService.getById(tFrom) == null ? "Удаленный ЦФО" : cfoService.getById(tFrom).getCfoName();
                to = personService.getById(tTo) == null ? "Удаленный пользователь" : personService.getById(tTo).getLogin();
                break;
            case  ("personToPerson"):
                from = personService.getById(tFrom) == null ? "Удаленный пользователь" : personService.getById(tFrom).getLogin();
                to = personService.getById(tTo) == null ? "Удаленный пользователь" : personService.getById(tTo).getLogin();
                break;
            case  ("personToShop"):
                from = personService.getById(tFrom) == null ? "Удаленный пользователь" : personService.getById(tFrom).getLogin();
                to = "Магазин";
                break;
        }
    }
}




