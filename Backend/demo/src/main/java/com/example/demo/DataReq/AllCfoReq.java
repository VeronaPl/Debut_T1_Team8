package com.example.demo.DataReq;

import com.example.demo.BDData.CFO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AllCfoReq {
    private int basic_sum;
    private int sum;

    public AllCfoReq(List<CFO> lst) {
        basic_sum = 0;
        sum = 0;
        for (CFO cfo : lst){
            sum += cfo.getSum();
            basic_sum += cfo.getBasicSum();
        }
    }
}
