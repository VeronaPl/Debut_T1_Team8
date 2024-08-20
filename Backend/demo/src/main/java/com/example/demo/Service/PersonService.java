package com.example.demo.Service;

import com.example.demo.BDData.Person;
import com.example.demo.Repo.PersonRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersonService {

    @Autowired
    private PersonRepo repo;

    public List<Person> getAll() {
        return repo.findAll();
    }

    public Person getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Person create(Person item) {
        return repo.save(item);
    }

    public Person update(Long id, Person item) {
        Person existing = repo.findById(id).orElse(null);
        if (existing != null) {
            existing.setFirstName(item.getFirstName());
            existing.setLastName(item.getLastName());
            existing.setAverageName(item.getAverageName());
            existing.setLogin(item.getLogin());
            existing.setRole(item.getRole());
            existing.setSum(item.getSum());
            existing.setPassword(item.getPassword());
            return repo.save(existing);
        } else {
            return null;
        }
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
