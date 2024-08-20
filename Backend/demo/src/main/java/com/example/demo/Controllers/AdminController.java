package com.example.demo.Controllers;

import com.example.demo.BDData.CFO;
import com.example.demo.BDData.Person;
import com.example.demo.BDData.Transaction;
import com.example.demo.Data.*;
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

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Tag(name="Контроллер Администатора")
@RestController
public class AdminController {
    @Autowired
    private PersonService personService;

    @Autowired
    private CFOService cfoService;

    @Autowired
    private TransactionService transactionService;

    // Администратор

    @Operation(summary = "Просмотр истории операций", security = {@SecurityRequirement(name = "bearer-key")})
    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionReq>> transactions() {
        if (isNotAdmin()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<Transaction> transactions = transactionService.getAll();

        return transactions != null &&  !transactions.isEmpty()
                ? new ResponseEntity<>(transactions.stream().map(t -> new TransactionReq(t, cfoService, personService)).collect(Collectors.toList()), HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @Operation(summary = "Просмотр истории операций - без участия админа", security = {@SecurityRequirement(name = "bearer-key")})
    @GetMapping("/transactionsWithoutAdmin")
    public ResponseEntity<List<TransactionReq>> transactionsWithoutAdmin() {
        if (isNotAdmin()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<Transaction> transactions = transactionService.getAll().stream().filter(t -> t.getTFrom() != 1L).toList();

        return  !transactions.isEmpty()
                ? new ResponseEntity<>(transactions.stream().map(t -> new TransactionReq(t, cfoService, personService)).collect(Collectors.toList()), HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @Operation(summary = "Просмотр списка цфо", security = {@SecurityRequirement(name = "bearer-key")})
    @GetMapping("/cfoes")
    public ResponseEntity<List<CFOSumReq>> cfoes() {
        if (isNotAdmin()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<CFO> cfoes = cfoService.getAll();

        return cfoes != null &&  !cfoes.isEmpty()
                ? new ResponseEntity<>(cfoes.stream().map(t -> new CFOSumReq(t, personService)).collect(Collectors.toList()), HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Operation(summary = "Просмотр цфо, у которых завершился бюджет", security = {@SecurityRequirement(name = "bearer-key")})
    @GetMapping("/oldCfoes")
    public ResponseEntity<List<CFOSumReq>> oldCfoes() {
        if (isNotAdmin()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<CFO> cfoes = cfoService.getAll().stream().filter(c -> c.getFinalDate().before(new Date())).toList();

        return cfoes != null &&  !cfoes.isEmpty()
                ? new ResponseEntity<>(cfoes.stream().map(t -> new CFOSumReq(t, personService)).collect(Collectors.toList()), HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Operation(summary = "Просмотр ЦФО по ID", security = {@SecurityRequirement(name = "bearer-key")})
    @GetMapping("/cfoByID")
    public ResponseEntity<CFOSumReq> cfoById(Long Id) {
        if (isNotAdmin()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        CFO cfo = cfoService.getById(Id);
        if (cfo == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(new CFOSumReq(cfo, personService), HttpStatus.OK);
    }

    @Operation(summary = "Создание цфо и назначение кого-то пользователя его владельцем по ID", security = {@SecurityRequirement(name = "bearer-key")})
    @PostMapping("/makeCFObyId")
    public ResponseEntity<CFOSumReq> makeCFObyId(String cfoName, Integer sum, Long ownerId, String finalDate) {
        if (isNotAdmin()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        boolean cfoIs = cfoService.getAll().stream().anyMatch(p -> Objects.equals(p.getCfoName(), cfoName));
        if (cfoIs){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Person pers = personService.getById(ownerId);
        if (pers == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (Objects.equals(pers.getRole(), "user") || ownerId == 1L){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        CFO cfo = new CFO();
        cfo.setCfoName(cfoName);
        cfo.setSum(sum);
        cfo.setBasicSum(sum);
        cfo.setOwnerId(ownerId);
        try {
            cfo.setFinalDate(formatter.parse(finalDate));
        } catch (ParseException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        cfoService.create(cfo);

        return new ResponseEntity<>(new CFOSumReq(cfo, personService), HttpStatus.OK);
    }

    @Operation(summary = "Создание цфо и назначение кого-то пользователя его владельцем по Логину", security = {@SecurityRequirement(name = "bearer-key")})
    @PostMapping("/makeCFObyLog")
    public ResponseEntity<CFOSumReq> makeCFObyLog(String cfoName, Integer sum, String ownerLog, String finalDate) throws ParseException {
        if (isNotAdmin()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        boolean persIs = personService.getAll().stream().anyMatch(p -> Objects.equals(p.getLogin(), ownerLog));
        if (!persIs){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (Objects.equals(ownerLog, "admin")){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Person pers = personService.getAll().stream().filter(p -> Objects.equals(p.getLogin(), ownerLog)).findFirst().get();
        if (Objects.equals(pers.getRole(), "user")){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        CFO cfo = new CFO();
        cfo.setCfoName(cfoName);
        cfo.setSum(sum);
        cfo.setBasicSum(sum);
        cfo.setOwnerId(pers.getId());
        try {
            cfo.setFinalDate(formatter.parse(finalDate));
        } catch (ParseException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        cfoService.create(cfo);

        return new ResponseEntity<>(new CFOSumReq(cfo, personService), HttpStatus.OK);
    }

    @Operation(summary = "Изменение буджета ЦФО", security = {@SecurityRequirement(name = "bearer-key")})
    @PutMapping("/adminToCFO")
    public ResponseEntity<CFOSumReq> adminToCFO(Long cfoId, Integer newSum, String comment) {
        if (isNotAdmin()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        CFO cfo = cfoService.getById(cfoId);

        if (cfo == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        int r = newSum - cfo.getBasicSum();
        int s = cfo.getSum() + r;
        if (s <= 0){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        cfo.setBasicSum(newSum);
        cfo.setSum(s);
        cfoService.update(cfo.getId(), cfo);

        Transaction tran = new Transaction();
        tran.setDatatime(new Date());
        tran.setTFrom(1L);
        tran.setTTo(cfoId);
        tran.setOwner(cfo.getOwnerId());
        tran.setComment(comment);
        tran.setType("adminToCFO");
        tran.setSum(r);
        transactionService.create(tran);
        return new ResponseEntity<>(new CFOSumReq(cfo, personService), HttpStatus.OK);
    }

    @Operation(summary = "Изменение времени конца периода буджета", security = {@SecurityRequirement(name = "bearer-key")})
    @PutMapping("/newFinalDateCFO")
    public ResponseEntity<CFOSumReq> newFinalDateCFO(Long cfoId, String newFinalDate) {
        if (isNotAdmin()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        CFO cfo = cfoService.getById(cfoId);

        if (cfo == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            cfo.setFinalDate(formatter.parse(newFinalDate));
        } catch (ParseException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        cfoService.update(cfo.getId(), cfo);
        return new ResponseEntity<>(new CFOSumReq(cfo, personService), HttpStatus.OK);
    }

    @Operation(summary = "Пополнение буджета пользователя по Id", security = {@SecurityRequirement(name = "bearer-key")})
    @PostMapping("/adminToPersonByID")
    public ResponseEntity<TransactionReq> adminToPersonByID(Long persId, Integer s, String comment) {
        if (isNotAdmin()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Person pers = personService.getById(persId);

        if (pers == null ){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if ( s <= 0){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        pers.setSum(pers.getSum() + s);
        personService.update(pers.getId(), pers);

        Transaction tran = new Transaction();
        tran.setDatatime(new Date());
        tran.setTFrom(1L);
        tran.setTTo(persId);
        tran.setOwner(0L);
        tran.setComment(comment);
        tran.setType("adminToPerson");
        tran.setSum(s);
        transactionService.create(tran);
        return new ResponseEntity<>(new TransactionReq(tran, cfoService, personService), HttpStatus.OK);
    }

    @Operation(summary = "Пополнение буджета пользователя по логину", security = {@SecurityRequirement(name = "bearer-key")})
    @PostMapping("/adminToPersonByLog")
    public ResponseEntity<TransactionReq> adminToPersonByLog(String login, Integer s, String comment) {
        if (isNotAdmin()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        boolean persIs = personService.getAll().stream().anyMatch(p -> Objects.equals(p.getLogin(), login));
        if (!persIs){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (s <= 0){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Person pers = personService.getAll().stream().filter(p -> Objects.equals(p.getLogin(), login)).findFirst().get();

        pers.setSum(pers.getSum() + s);
        personService.update(pers.getId(), pers);

        Transaction tran = new Transaction();
        tran.setDatatime(new Date());
        tran.setTFrom(1L);
        tran.setTTo(pers.getId());
        tran.setOwner(0L);
        tran.setComment(comment);
        tran.setType("adminToPerson");
        tran.setSum(s);
        transactionService.create(tran);
        return new ResponseEntity<>(new TransactionReq(tran, cfoService, personService), HttpStatus.OK);
    }

    @Operation(summary = "Удаление пользователя (владельца) по Id", security = {@SecurityRequirement(name = "bearer-key")})
    @DeleteMapping("/deletePersonByID")
    public ResponseEntity<String> deletePersonByID(Long Id) {
        if (isNotAdmin()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (Id == 1L){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (personService.getById(Id) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        personService.delete(Id);

        return new ResponseEntity<>("remotely", HttpStatus.OK);
    }

    @Operation(summary = "Удаление пользователя (владельца) по Логину", security = {@SecurityRequirement(name = "bearer-key")})
    @DeleteMapping("/deletePersonByLog")
    public ResponseEntity<String> deletePersonByLog(String login) {
        if (isNotAdmin()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        boolean persIs = personService.getAll().stream().anyMatch(p -> Objects.equals(p.getLogin(), login));
        if (!persIs){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Person pers = personService.getAll().stream().filter(p -> Objects.equals(p.getLogin(), login)).findFirst().get();

        personService.delete(pers.getId());

        return new ResponseEntity<>("remotely", HttpStatus.OK);
    }

    @Operation(summary = "Удаление ЦФО", security = {@SecurityRequirement(name = "bearer-key")})
    @DeleteMapping("/deleteCFO")
    public ResponseEntity<String> deleteCFO(Long Id) {
        if (isNotAdmin()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        CFO cfo = cfoService.getById(Id);
        if (cfo == null ){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        cfoService.delete(Id);

        return new ResponseEntity<>("remotely", HttpStatus.OK);
    }

    @Operation(summary = "Поменять роль пользователя по Id", security = {@SecurityRequirement(name = "bearer-key")})
    @PutMapping("/switchRolePersonByID")
    public ResponseEntity<PersonReq> switchRolePersonByID(Long Id) {
        if (isNotAdmin()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Person pers = personService.getById(Id);
        if (Id == 1L){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (pers == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (Objects.equals(pers.getRole(), "user")){
            pers.setRole("owner");
        }else{
            pers.setRole("user");
        }

        personService.update(Id, pers);

        return new ResponseEntity<>(new PersonReq(pers), HttpStatus.OK);
    }

    @Operation(summary = "Поменять роль пользователя по логину", security = {@SecurityRequirement(name = "bearer-key")})
    @PutMapping("/switchRolePersonByLogin")
    public ResponseEntity<PersonReq> switchRolePersonByLogin(String login) {
        if (isNotAdmin()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        boolean persIs = personService.getAll().stream().anyMatch(p -> Objects.equals(p.getLogin(), login));
        if (!persIs){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Person pers = personService.getAll().stream().filter(p -> Objects.equals(p.getLogin(), login)).findFirst().get();

        if (Objects.equals(login, "admin")){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (Objects.equals(pers.getRole(), "user")){
            pers.setRole("owner");
        }else{
            pers.setRole("user");
        }

        personService.update(pers.getId(), pers);

        return new ResponseEntity<>(new PersonReq(pers), HttpStatus.OK);
    }

    @Operation(summary = "Поменять владельца в ЦФО по Id пользователя", security = {@SecurityRequirement(name = "bearer-key")})
    @PutMapping("/switchOwnerCFOByID")
    public ResponseEntity<CFOSumReq> switchOwnerCFOByID(Long CFOId, Long Id) {
        if (isNotAdmin()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Person pers = personService.getById(Id);
        CFO cfo = cfoService.getById(CFOId);
        if (pers == null || cfo == null ){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if ( Objects.equals(pers.getRole(), "user") || Id == 1L){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        cfo.setOwnerId(Id);
        cfoService.update(CFOId, cfo);

        return new ResponseEntity<>(new CFOSumReq(cfo, personService), HttpStatus.OK);
    }

    @Operation(summary = "Поменять владельца в ЦФО по Логину пользователя", security = {@SecurityRequirement(name = "bearer-key")})
    @PutMapping("/switchOwnerCFOByLog")
    public ResponseEntity<CFOSumReq> switchOwnerCFOByLog(Long CFOId, String login) {
        if (isNotAdmin()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        boolean persIs = personService.getAll().stream().anyMatch(p -> Objects.equals(p.getLogin(), login));
        if (!persIs){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (Objects.equals(login, "admin")){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Person pers = personService.getAll().stream().filter(p -> Objects.equals(p.getLogin(), login)).findFirst().get();
        CFO cfo = cfoService.getById(CFOId);
        if (cfo == null || Objects.equals(pers.getRole(), "user")){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        cfo.setOwnerId(pers.getId());
        cfoService.update(CFOId, cfo);

        return new ResponseEntity<>(new CFOSumReq(cfo, personService), HttpStatus.OK);
    }

    @Operation(summary = "Смена названия ЦФО", security = {@SecurityRequirement(name = "bearer-key")})
    @PutMapping("/nameCfo")
    public ResponseEntity<CFOSumReq> nameCfo(Long Id, String newName) {
        if (isNotAdmin()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        boolean cfoIs = cfoService.getAll().stream().anyMatch(p -> Objects.equals(p.getCfoName(), newName));
        if (cfoIs){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        CFO cfo = cfoService.getById(Id);
        if (cfo == null ){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        cfo.setCfoName(newName);
        cfoService.update(Id, cfo);
        return new ResponseEntity<>(new CFOSumReq(cfo, personService), HttpStatus.OK);
    }

    @Operation(summary = "Просмотр истории операций связанных с цфо (type = 'cfoes' or 'users' or 'admin' or '')) формат даты 'yyyy-MM-dd HH:mm:ss'",
            security = {@SecurityRequirement(name = "bearer-key")})
    @GetMapping("/cfoesTransactions")
    public ResponseEntity<List<TransactionReq>> cfoesTransactions(@RequestParam(required = false) Long cfoId, @RequestParam(required = false) Long personId,
                                                                  @RequestParam(required = false) String personLog, @RequestParam(required = false) String type,
                                                                  @RequestParam(required = false) String start, @RequestParam(required = false) String end) {
        if (isNotAdmin()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<Transaction> transactions = transactionService.getAll();

        if (cfoId == null){
            transactions = transactions.stream().filter(t -> !Objects.equals(t.getOwner(), 0L)).toList();
        }else{
            CFO cfo = cfoService.getById(cfoId);
            if (cfo == null ){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            transactions = transactions.stream().filter(t -> (Objects.equals(t.getTFrom(), cfoId) && (Objects.equals(t.getType(), "cfoToCFO")
                    || Objects.equals(t.getType(), "cfoToPerson") ) )
                    || (Objects.equals(t.getTTo(), cfoId) && (Objects.equals(t.getType(), "cfoToCFO") || Objects.equals(t.getType(), "adminToCFO")))
            ).toList();
        }

        if (personId != null){
            Person p = personService.getById(personId);
            if (p == null){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            transactions = transactions.stream().filter(t -> Objects.equals(t.getType(), "cfoToPerson") && Objects.equals(t.getTTo(), personId)).toList();
        }

        if (personLog != null){
            boolean persIs = personService.getAll().stream().anyMatch(p -> Objects.equals(p.getLogin(), personLog));
            if (!persIs){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            Person pp = personService.getAll().stream().filter(p -> Objects.equals(p.getLogin(), personLog)).findFirst().get();
            transactions = transactions.stream().filter(t -> Objects.equals(t.getType(), "cfoToPerson") && Objects.equals(t.getTTo(), pp.getId())).toList();
        }


        if (Objects.equals(type, "cfoes")){
            transactions = transactions.stream().filter(t -> Objects.equals(t.getType(), "cfoToCFO")).toList();
        }
        if (Objects.equals(type, "users")){
            transactions = transactions.stream().filter(t -> Objects.equals(t.getType(), "cfoToPerson")).toList();
        }
        if (Objects.equals(type, "admin")){
            transactions = transactions.stream().filter(t -> Objects.equals(t.getType(), "adminToCFO")).toList();
        }

        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        if (start != null){
            transactions = transactions.stream().filter(t -> {
                try {
                    return t.getDatatime().after(formatter.parse(start));
                } catch (ParseException e) {
                    throw new RuntimeException(e);
                }
            }).toList();
        }
        if (end != null){
            transactions = transactions.stream().filter(t -> {
                try {
                    return t.getDatatime().before(formatter.parse(end));
                } catch (ParseException e) {
                    throw new RuntimeException(e);
                }
            }).toList();
        }

        return transactions != null &&  !transactions.isEmpty()
                ? new ResponseEntity<>(transactions.stream().map(t -> new TransactionReq(t, cfoService, personService)).collect(Collectors.toList()), HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Operation(summary = "Просмотр бюджета по всему", security = {@SecurityRequirement(name = "bearer-key")})
    @GetMapping("/allSum")
    public ResponseEntity<AllSumReq> allSum() {
        if (isNotAdmin()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(new AllSumReq(cfoService.getAll(), personService.getAll()), HttpStatus.OK);
    }

    private boolean isNotAdmin(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        final String id = userDetails.getUsername();
        Person pers = personService.getById( Long.parseLong(id));
        return (!Objects.equals(pers.getRole(), "admin"));
    }
}
