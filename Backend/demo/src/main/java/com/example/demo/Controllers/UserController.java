package com.example.demo.Controllers;

import com.example.demo.BDData.Person;
import com.example.demo.BDData.Transaction;
import com.example.demo.Config.Sha256;
import com.example.demo.Data.TransactionReq;
import com.example.demo.Service.AuthService;
import com.example.demo.Service.CFOService;
import com.example.demo.Service.PersonService;
import com.example.demo.Service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Tag(name="Контроллер пользователя")
@RestController
public class UserController {
    @Autowired
    private PersonService personService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private CFOService cfoService;

    @Autowired
    private AuthService authService;

    // Функции доступные пользователю и владельцу
    @Operation(summary = "Удаление пользователя (себя)", security = {@SecurityRequirement(name = "bearer-key")})
    @DeleteMapping("/deletePerson")
    public ResponseEntity<String> deletePerson() {
        Person pers = loginOfUserOrOwner();
        if (pers == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        personService.delete(pers.getId());

        return new ResponseEntity<>("remotely", HttpStatus.OK);
    }

    @Operation(summary = "Перевод пользователю по логину", security = {@SecurityRequirement(name = "bearer-key")})
    @PostMapping("/personToPersonByLog")
    public ResponseEntity<TransactionReq> personToPersonByLog(String login, Integer s, String comment) {
        Person pers = loginOfUserOrOwner();
        if (pers == null || pers.getSum() < s || s <= 0){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        boolean persIs = personService.getAll().stream().anyMatch(p -> Objects.equals(p.getLogin(), login));
        if (!persIs){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Person persAnother = personService.getAll().stream().filter(p -> Objects.equals(p.getLogin(), login)).findFirst().get();

        if (Objects.equals(persAnother.getRole(), "admin")){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        pers.setSum(pers.getSum() - s);
        personService.update(pers.getId(), pers);
        persAnother.setSum(persAnother.getSum() + s);
        personService.update(persAnother.getId(), persAnother);

        Transaction tran = new Transaction();
        tran.setDatatime(new Date());
        tran.setTFrom(pers.getId());
        tran.setTTo(persAnother.getId());
        tran.setOwner(0L);
        tran.setComment(comment);
        tran.setType("personToPerson");
        tran.setSum(s);
        transactionService.create(tran);
        return new ResponseEntity<>(new TransactionReq(tran, cfoService, personService), HttpStatus.OK);
    }

    @Operation(summary = "Перевод пользователю по ID", security = {@SecurityRequirement(name = "bearer-key")})
    @PostMapping("/personToPersonById")
    public ResponseEntity<TransactionReq> personToPersonById(Long id, Integer s, String comment) {
        Person pers = loginOfUserOrOwner();
        if (pers == null || pers.getSum() < s || s <= 0){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Person persAnother = personService.getById(id);
        if (persAnother == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (Objects.equals(persAnother.getRole(), "admin")){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        pers.setSum(pers.getSum() - s);
        personService.update(pers.getId(), pers);
        persAnother.setSum(persAnother.getSum() + s);
        personService.update(persAnother.getId(), persAnother);

        Transaction tran = new Transaction();
        tran.setDatatime(new Date());
        tran.setTFrom(pers.getId());
        tran.setTTo(persAnother.getId());
        tran.setOwner(0L);
        tran.setComment(comment);
        tran.setType("personToPerson");
        tran.setSum(s);
        transactionService.create(tran);
        return new ResponseEntity<>(new TransactionReq(tran, cfoService, personService), HttpStatus.OK);
    }

    @Operation(summary = "Перевод коинов в магазин", security = {@SecurityRequirement(name = "bearer-key")})
    @PostMapping("/personToShop")
    public ResponseEntity<TransactionReq> personToShop(Integer s, String comment) {
        Person pers = loginOfUserOrOwner();
        if (pers == null || s <= 0){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (pers.getSum() < s){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }


        pers.setSum(pers.getSum() - s);
        personService.update(pers.getId(), pers);

        Transaction tran = new Transaction();
        tran.setDatatime(new Date());
        tran.setTFrom(pers.getId());
        tran.setTTo(0L);
        tran.setOwner(0L);
        tran.setComment(comment);
        tran.setType("personToShop");
        tran.setSum(s);
        transactionService.create(tran);
        return new ResponseEntity<>(new TransactionReq(tran, cfoService, personService), HttpStatus.OK);
    }


    @Operation(summary = "Поменять ФИО, никнейм", security = {@SecurityRequirement(name = "bearer-key")})
    @PutMapping("/newName")
    public ResponseEntity<String> newFioNik(String firstName, String averageName, String lastName, String login) {
        Person pers = loginOfUserOrOwner();
        if (pers == null || firstName == null || averageName == null || lastName == null || login == null ||
                firstName.isEmpty() || averageName.isEmpty()  || lastName.isEmpty()  || login.isEmpty() ){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        boolean persIs = personService.getAll().stream().anyMatch(p -> Objects.equals(p.getLogin(), login));
        if (persIs && !Objects.equals(pers.getLogin(), login)){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        pers.setLogin(login);
        pers.setFirstName(firstName);
        pers.setAverageName(averageName);
        pers.setLastName(lastName);

        personService.update(pers.getId(), pers);

        return new ResponseEntity<>("update", HttpStatus.OK);
    }

    @Operation(summary = "Поменять пароль", security = {@SecurityRequirement(name = "bearer-key")})
    @PutMapping("/newPass")
    public ResponseEntity<String> newPass(String old_password, String password) {
        Person pers = loginOfUserOrOwner();
        if (pers == null || password == null || password.isEmpty()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        String old_hashPass = Sha256.sha256(old_password);
        String hashPass = Sha256.sha256(password);
        if (!Objects.equals(old_hashPass, pers.getPassword())){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        pers.setPassword(hashPass);

        personService.update(pers.getId(), pers);

        return new ResponseEntity<>("new pass", HttpStatus.OK);
    }


    @Operation(summary = "Просмотр транзакций пользователя", security = {@SecurityRequirement(name = "bearer-key")})
    @GetMapping("/userTransactions")
    public ResponseEntity<List<TransactionReq>> userTransactions() {
        Person pers = loginOfUserOrOwner();
        if (pers == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<Transaction> transactions = transactionService.getAll().stream()
                .filter(t -> (Objects.equals(t.getTFrom(), pers.getId()) || Objects.equals(t.getTTo(), pers.getId())) &&
                        (Objects.equals(t.getType(), "adminToPerson") || Objects.equals(t.getType(), "personToPerson") ||
                                Objects.equals(t.getType(), "personToShop") || Objects.equals(t.getType(), "cfoToPerson"))).toList();

        return transactions != null &&  !transactions.isEmpty()
                ? new ResponseEntity<>(transactions.stream().map(t -> new TransactionReq(t, cfoService, personService)).collect(Collectors.toList()), HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Operation(summary = "Просмотр транзакций пользователя - пополнения", security = {@SecurityRequirement(name = "bearer-key")})
    @GetMapping("/userTransactionsPlus")
    public ResponseEntity<List<TransactionReq>> userTransactionsPlus() {
        Person pers = loginOfUserOrOwner();
        if (pers == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<Transaction> transactions = transactionService.getAll().stream()
                .filter(t -> Objects.equals(t.getTTo(), pers.getId()) && (Objects.equals(t.getType(), "adminToPerson") ||
                        Objects.equals(t.getType(), "personToPerson") || Objects.equals(t.getType(), "cfoToPerson"))).toList();

        return transactions != null &&  !transactions.isEmpty()
                ? new ResponseEntity<>(transactions.stream().map(t -> new TransactionReq(t, cfoService, personService)).collect(Collectors.toList()), HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Operation(summary = "Просмотр транзакций пользователя - траты", security = {@SecurityRequirement(name = "bearer-key")})
    @GetMapping("/userTransactionsMinus")
    public ResponseEntity<List<TransactionReq>> userTransactionsMinus() {
        Person pers = loginOfUserOrOwner();
        if (pers == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<Transaction> transactions = transactionService.getAll().stream()
                .filter(t -> Objects.equals(t.getTFrom(), pers.getId()) &&
                        (Objects.equals(t.getType(), "personToPerson") || Objects.equals(t.getType(), "personToShop"))).toList();

        return transactions != null &&  !transactions.isEmpty()
                ? new ResponseEntity<>(transactions.stream().map(t -> new TransactionReq(t, cfoService, personService)).collect(Collectors.toList()), HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Operation(summary = "Просмотр транзакций пользователя - магазин", security = {@SecurityRequirement(name = "bearer-key")})
    @GetMapping("/userTransactionsShop")
    public ResponseEntity<List<TransactionReq>> userTransactionsShop() {
        Person pers = loginOfUserOrOwner();
        if (pers == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<Transaction> transactions = transactionService.getAll().stream()
                .filter(t -> (Objects.equals(t.getTFrom(), pers.getId()) && Objects.equals(t.getType(), "personToShop"))).toList();

        return transactions != null &&  !transactions.isEmpty()
                ? new ResponseEntity<>(transactions.stream().map(t -> new TransactionReq(t, cfoService, personService)).collect(Collectors.toList()), HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Operation(summary = "Просмотр транзакций пользователя - переводы", security = {@SecurityRequirement(name = "bearer-key")})
    @GetMapping("/userTransactionsTo")
    public ResponseEntity<List<TransactionReq>> userTransactionsTo() {
        Person pers = loginOfUserOrOwner();
        if (pers == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<Transaction> transactions = transactionService.getAll().stream()
                .filter(t -> (Objects.equals(t.getTFrom(), pers.getId()) || Objects.equals(t.getTTo(), pers.getId())) && Objects.equals(t.getType(), "personToPerson")).toList();

        return transactions != null &&  !transactions.isEmpty()
                ? new ResponseEntity<>(transactions.stream().map(t -> new TransactionReq(t, cfoService, personService)).collect(Collectors.toList()), HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    private Person loginOfUserOrOwner(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        final String id = userDetails.getUsername();
        Person pers = personService.getById( Long.parseLong(id));
        if (Objects.equals(pers.getRole(), "user") || Objects.equals(pers.getRole(), "owner")){
            return pers;
        }
        return null;
    }
}
