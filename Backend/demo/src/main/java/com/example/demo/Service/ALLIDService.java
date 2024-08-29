package com.example.demo.Service;

import com.example.demo.BDData.ALLID;
import com.example.demo.BDData.CFO;
import com.example.demo.BDData.Person;
import com.example.demo.Repo.ALLIDRepo;
import com.example.demo.Repo.CFORepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class ALLIDService {
    @Autowired
    private ALLIDRepo repo;

    public Long getALLId(Long tableId, String typeId) {
        return repo.findAll().stream().filter(p -> Objects.equals(p.getTypeId(), typeId) && Objects.equals(p.getTableId(), tableId)).findFirst().get().getId();
    }

    public Long getTableIdType(Long id, String typeId) {
        ALLID a = repo.findById(id).get();
        if (!Objects.equals(a.getTypeId(), typeId))
            return null;
        return repo.findById(id).get().getTableId();
    }

    public ALLID getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public ALLID create(ALLID item) {
        return repo.save(item);
    }

}
