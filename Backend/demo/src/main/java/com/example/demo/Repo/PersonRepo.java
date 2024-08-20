package com.example.demo.Repo;

import com.example.demo.BDData.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface PersonRepo extends JpaRepository<Person, Long> {

}
