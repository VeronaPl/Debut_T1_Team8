package com.example.demo.Repo;

import com.example.demo.BDData.CFO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface CFORepo extends JpaRepository<CFO, Long> {

}
