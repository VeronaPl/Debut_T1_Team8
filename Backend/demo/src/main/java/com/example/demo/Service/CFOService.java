package com.example.demo.Service;

import com.example.demo.BDData.CFO;
import com.example.demo.Repo.CFORepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CFOService {
    @Autowired
    private CFORepo repo;

    public List<CFO> getAll() {
        return repo.findAll();
    }

    public CFO getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public CFO create(CFO item) {
        return repo.save(item);
    }

    public CFO update(Long id, CFO item) {
        CFO existing = repo.findById(id).orElse(null);
        if (existing != null) {
            existing.setCfoName(item.getCfoName());
            existing.setSum(item.getSum());
            existing.setBasicSum(item.getBasicSum());
            existing.setOwnerId(item.getOwnerId());
            return repo.save(existing);
        } else {
            return null;
        }
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
