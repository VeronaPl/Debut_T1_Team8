package com.example.demo.Repo;

import com.example.demo.BDData.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface TransactionRepo extends JpaRepository<Transaction, Long> {

}
