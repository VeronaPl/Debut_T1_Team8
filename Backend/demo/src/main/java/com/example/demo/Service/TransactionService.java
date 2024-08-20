package com.example.demo.Service;

import com.example.demo.BDData.Transaction;
import com.example.demo.Repo.TransactionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepo repo;

    public List<Transaction> getAll() {
        return repo.findAll();
    }

    public Transaction getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Transaction create(Transaction item) {
        return repo.save(item);
    }

    public Transaction update(Long id, Transaction item) {
        Transaction existing = repo.findById(id).orElse(null);
        if (existing != null) {
            existing.setTFrom(item.getTFrom());
            existing.setTTo(item.getTTo());
            existing.setType(item.getType());
            existing.setComment(item.getComment());
            existing.setSum(item.getSum());
            existing.setDatatime(item.getDatatime());
            return repo.save(existing);
        } else {
            return null;
        }
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
