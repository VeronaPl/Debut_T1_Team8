package com.example.demo.DataReq;

import com.example.demo.BDData.Transaction;
import com.example.demo.Service.ALLIDService;
import com.example.demo.Service.CFOService;
import com.example.demo.Service.PersonService;
import lombok.Getter;
import lombok.Setter;

import java.text.SimpleDateFormat;
import java.util.Objects;

@Getter
@Setter
public class TransactionReq {
    private Long id;
    private String from;
    private String to;
    private Integer sum;
    private String type;
    private String comment;
    private String datatime;
    private Long id_cfo_from;
    private Long id_cfo_to;

    public TransactionReq(Transaction tran, CFOService cfoService, PersonService personService, ALLIDService allidService) {
        id = tran.getId();
        Long tFrom = tran.getTFrom();
        Long tTo = tran.getTTo();
        sum = tran.getSum();
        type = tran.getType();
        comment = tran.getComment();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        datatime = formatter.format(tran.getDatatime());
        switch (type) {
            case  ("adminToCFO"):
                from = "Система";
                to = cfoService.getById(tTo) == null ? "Удаленный ЦФО" : cfoService.getById(tTo).getCfoName();
                if (!Objects.equals(to, "Удаленный ЦФО"))
                    id_cfo_to = allidService.getALLId(tTo, "cfo");
                break;
            case  ("adminToPerson"):
                from = "Система";
                to = personService.getById(tTo) == null ? "Удаленный пользователь" : personService.getById(tTo).getLogin();
                break;
            case  ("cfoToCFO"):
                from = cfoService.getById(tFrom) == null ? "Удаленный ЦФО" : cfoService.getById(tFrom).getCfoName();
                to = cfoService.getById(tTo) == null ? "Удаленный ЦФО" : cfoService.getById(tTo).getCfoName();
                if (!Objects.equals(to, "Удаленный ЦФО"))
                    id_cfo_to = allidService.getALLId(tTo, "cfo");
                if (!Objects.equals(from, "Удаленный ЦФО"))
                    id_cfo_from = allidService.getALLId(tFrom, "cfo");
                break;
            case  ("cfoToPerson"):
                from = cfoService.getById(tFrom) == null ? "Удаленный ЦФО" : cfoService.getById(tFrom).getCfoName();
                to = personService.getById(tTo) == null ? "Удаленный пользователь" : personService.getById(tTo).getLogin();
                if (!Objects.equals(from, "Удаленный ЦФО"))
                    id_cfo_from = allidService.getALLId(tFrom, "cfo");
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




