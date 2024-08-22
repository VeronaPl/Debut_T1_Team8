package com.example.demo.Controllers;

import com.example.demo.BDData.CFO;
import com.example.demo.BDData.Person;
import com.example.demo.Data.*;
import com.example.demo.Service.CFOService;
import com.example.demo.Service.PersonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Tag(name="Контроллер Общий")
@RestController
public class UniteController {
    @Autowired
    private PersonService personService;

    @Autowired
    private CFOService cfoService;

    // Функции доступные без регистрации

    @Operation(summary = "Просмотр всех пользователей")
    @GetMapping("/persons")
    public ResponseEntity<List<PersonReq>> persons() {
        List<Person> persons = personService.getAll();

        return persons != null &&  !persons.isEmpty()
                ? new ResponseEntity<>(persons.stream().map(PersonReq::new).collect(Collectors.toList()), HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @Operation(summary = "Просмотр юзеров")
    @GetMapping("/users")
    public ResponseEntity<List<PersonReq>> users() {
        List<Person> persons = personService.getAll().stream().filter(p -> Objects.equals(p.getRole(), "user")).toList();

        return persons != null &&  !persons.isEmpty()
                ? new ResponseEntity<>(persons.stream().map(PersonReq::new).collect(Collectors.toList()), HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @Operation(summary = "Просмотр владельцев")
    @GetMapping("/owners")
    public ResponseEntity<List<PersonReq>> owners() {
        List<Person> persons = personService.getAll().stream().filter(p -> Objects.equals(p.getRole(), "owner")).toList();

        return persons != null &&  !persons.isEmpty()
                ? new ResponseEntity<>(persons.stream().map(PersonReq::new).collect(Collectors.toList()), HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @Operation(summary = "Просмотр пользователя по ID")
    @GetMapping("/personByID")
    public ResponseEntity<PersonReq> personByID(Long Id) {
        Person pers = personService.getById(Id);
        if (pers == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(new PersonReq(pers), HttpStatus.OK);
    }
    @Operation(summary = "Просмотр пользователя по Логину")
    @GetMapping("/personByLogin")
    public ResponseEntity<PersonReq> personByLogin(String login) {
        boolean persIs = personService.getAll().stream().anyMatch(p -> Objects.equals(p.getLogin(), login));
        if (!persIs){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Person pers = personService.getAll().stream().filter(p -> Objects.equals(p.getLogin(), login)).findFirst().get();

        return new ResponseEntity<>(new PersonReq(pers), HttpStatus.OK);
    }

    @Operation(summary = "Просмотр списка цфо")
    @GetMapping("/cfoesNames")
    public ResponseEntity<List<CFOReq>> cfoesNames() {
        List<CFO> cfoes = cfoService.getAll();

        return cfoes != null &&  !cfoes.isEmpty()
                ? new ResponseEntity<>(cfoes.stream().map(CFOReq::new).collect(Collectors.toList()), HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Operation(summary = "Просмотр цфо")
    @GetMapping("/cfoName")
    public ResponseEntity<CFOReq> cfoName(Long id) {
        CFO cfo = cfoService.getById(id);

        return cfo != null
                ? new ResponseEntity<>(new CFOReq(cfo), HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

}