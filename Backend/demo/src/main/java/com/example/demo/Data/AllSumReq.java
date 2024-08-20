package com.example.demo.Data;

import com.example.demo.BDData.CFO;
import com.example.demo.BDData.Person;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AllSumReq {
    private int basic_sum;
    private int cfo_sum;
    private int user_sum;

    public AllSumReq(List<CFO> lst, List<Person> lst0) {
        basic_sum = 0;
        cfo_sum = 0;
        user_sum = 0;
        for (CFO cfo : lst){
            cfo_sum += cfo.getSum();
            basic_sum += cfo.getBasicSum();
        }
        for (Person p : lst0){
            user_sum += p.getSum();
        }
    }
}
