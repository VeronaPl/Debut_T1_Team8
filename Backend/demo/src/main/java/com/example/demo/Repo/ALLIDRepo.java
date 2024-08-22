package com.example.demo.Repo;

import com.example.demo.BDData.ALLID;
import com.example.demo.BDData.CFO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ALLIDRepo extends JpaRepository<ALLID, Long> {

}
