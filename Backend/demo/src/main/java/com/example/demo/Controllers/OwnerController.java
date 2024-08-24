package com.example.demo.Controllers;

import com.example.demo.BDData.ALLID;
import com.example.demo.BDData.CFO;
import com.example.demo.BDData.Person;
import com.example.demo.BDData.Transaction;
import com.example.demo.DataReq.AllCfoReq;
import com.example.demo.DataReq.CFOSumReq;
import com.example.demo.DataReq.TransactionReq;
import com.example.demo.RoutingDataReq.AdminObjectReq;
import com.example.demo.RoutingDataReq.OwnerObjectReq;
import com.example.demo.RoutingDataReq.UserObjectReq;
import com.example.demo.Service.*;
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

@Tag(name="Контроллер владельца")
@RestController
public class OwnerController {
    @Autowired
    private PersonService personService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private CFOService cfoService;

    @Autowired
    private ALLIDService allidService;


    // Функции доступные владельцу

    @Operation(summary = "Просмотр списка цфо владельца", security = {@SecurityRequirement(name = "bearer-key")})
    @GetMapping("/ownerCfoes")
    public ResponseEntity<List<CFOSumReq>> ownerCfoes() {
        Person pers = loginOfOwner();
        if (pers == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<CFO> cfoes = cfoService.getAll().stream().filter(c -> Objects.equals(c.getOwnerId(), pers.getId())).toList();

        return cfoes != null &&  !cfoes.isEmpty()
                ? new ResponseEntity<>(cfoes.stream().map(t -> new CFOSumReq(t, personService, allidService)).collect(Collectors.toList()), HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Operation(summary = "Просмотр цфо по ID", security = {@SecurityRequirement(name = "bearer-key")})
    @GetMapping("/ownerCfo")
    public ResponseEntity<CFOSumReq> ownerCfo(Long AllId) {
        Person pers = loginOfOwner();
        if (pers == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        CFO cfo = cfoService.getById(allidService.getTableId(AllId));
        if (cfo == null || !Objects.equals(cfo.getOwnerId(), pers.getId())){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(new CFOSumReq(cfo, personService, allidService), HttpStatus.OK);
    }

    @Operation(summary = "Перевод от ЦФО к ЦФО", security = {@SecurityRequirement(name = "bearer-key")})
    @PostMapping("/cfoToCFO")
    public ResponseEntity<TransactionReq> cfoToCFO(Long All_id_from, Long All_id_to, Integer s, String comment) {
        Person pers = loginOfOwner();
        if (pers == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Long id_from = allidService.getTableId(All_id_from);
        Long id_to = allidService.getTableId(All_id_to);
        CFO cfo_from = cfoService.getById(id_from);
        if (cfo_from == null || !Objects.equals(cfo_from.getOwnerId(), pers.getId())){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (s > cfo_from.getSum() || s <= 0){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        CFO cfo_to = cfoService.getById(id_to);
        if (cfo_to == null || !Objects.equals(cfo_to.getOwnerId(), pers.getId())){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        cfo_from.setSum(cfo_from.getSum() - s);
        cfoService.update(id_from, cfo_from);
        cfo_to.setSum(cfo_to.getSum() + s);
        cfoService.update(id_to, cfo_to);

        Transaction tran = new Transaction();
        tran.setDatatime(new Date());
        tran.setTFrom(id_from);
        tran.setTTo(id_to);
        tran.setOwner(pers.getId());
        tran.setComment(comment);
        tran.setType("cfoToCFO");
        tran.setSum(s);
        transactionService.create(tran);
        return new ResponseEntity<>(new TransactionReq(tran, cfoService, personService, allidService), HttpStatus.OK);
    }

    @Operation(summary = "Перевод пользователю по Id", security = {@SecurityRequirement(name = "bearer-key")})
    @PostMapping("/cfoToPersonByID")
    public ResponseEntity<TransactionReq> cfoToPersonByID(Long All_id_from, Long All_persIdTo, Integer s, String comment) {
        Person pers = loginOfOwner();
        if (pers == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Long id_from = allidService.getTableId(All_id_from);
        Long persIdTo = allidService.getTableId(All_persIdTo);
        Person persTo = personService.getById(persIdTo);

        if (persTo == null ){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        CFO cfo_from = cfoService.getById(id_from);
        if (cfo_from == null || !Objects.equals(cfo_from.getOwnerId(), pers.getId())){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (s > cfo_from.getSum() || s <= 0 || persIdTo == 1L){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        cfo_from.setSum(cfo_from.getSum() - s);
        cfoService.update(id_from, cfo_from);
        persTo.setSum(persTo.getSum() + s);
        personService.update(persTo.getId(), persTo);

        Transaction tran = new Transaction();
        tran.setDatatime(new Date());
        tran.setTFrom(id_from);
        tran.setTTo(persIdTo);
        tran.setOwner(pers.getId());
        tran.setComment(comment);
        tran.setType("cfoToPerson");
        tran.setSum(s);
        transactionService.create(tran);
        return new ResponseEntity<>(new TransactionReq(tran, cfoService, personService, allidService), HttpStatus.OK);
    }

    @Operation(summary = "Перевод пользователю по Логину", security = {@SecurityRequirement(name = "bearer-key")})
    @PostMapping("/cfoToPersonByLog")
    public ResponseEntity<TransactionReq> cfoToPersonByLog(Long All_id_from, String persLogTo, Integer s, String comment) {
        Person pers = loginOfOwner();
        if (pers == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Long id_from = allidService.getTableId(All_id_from);
        boolean persIs = personService.getAll().stream().anyMatch(p -> Objects.equals(p.getLogin(), persLogTo));
        if (!persIs){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Person persTo = personService.getAll().stream().filter(p -> Objects.equals(p.getLogin(), persLogTo)).findFirst().get();

        CFO cfo_from = cfoService.getById(id_from);
        if (cfo_from == null || !Objects.equals(cfo_from.getOwnerId(), pers.getId())){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (s > cfo_from.getSum() || s <= 0 || Objects.equals(persLogTo, "admin")){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        cfo_from.setSum(cfo_from.getSum() - s);
        cfoService.update(id_from, cfo_from);
        persTo.setSum(persTo.getSum() + s);
        personService.update(persTo.getId(), persTo);

        Transaction tran = new Transaction();
        tran.setDatatime(new Date());
        tran.setTFrom(id_from);
        tran.setTTo(persTo.getId());
        tran.setOwner(pers.getId());
        tran.setComment(comment);
        tran.setType("cfoToPerson");
        tran.setSum(s);
        transactionService.create(tran);
        return new ResponseEntity<>(new TransactionReq(tran, cfoService, personService, allidService), HttpStatus.OK);
    }

    @Operation(summary = "Просмотр истории операций (type = 'cfoes' or 'users' or 'admin' or '')) формат даты 'yyyy-MM-dd HH:mm:ss'",
            security = {@SecurityRequirement(name = "bearer-key")})
    @GetMapping("/ownerTransactions")
    public ResponseEntity<List<TransactionReq>> ownerTransactions(@RequestParam(required = false) Long AllcfoId, @RequestParam(required = false) Long AllpersonId,
                                                                  @RequestParam(required = false) String personLog, @RequestParam(required = false) String type,
                                                                  @RequestParam(required = false) String start, @RequestParam(required = false) String end) {
        Person pers = loginOfOwner();
        if (pers == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<Transaction> transactions = transactionService.getAll();
        if (AllcfoId == null){
            transactions = transactions.stream().filter(t -> Objects.equals(t.getOwner(), pers.getId())).toList();
        }else{
            Long cfoId = allidService.getTableId(AllcfoId);

            CFO cfo = cfoService.getById(cfoId);
            if (cfo == null || !Objects.equals(cfo.getOwnerId(), pers.getId())){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            transactions = transactions.stream().filter(t -> (Objects.equals(t.getTFrom(), cfoId) && (Objects.equals(t.getType(), "cfoToCFO")
                    || Objects.equals(t.getType(), "cfoToPerson") ) )
                    || (Objects.equals(t.getTTo(), cfoId) && (Objects.equals(t.getType(), "cfoToCFO") || Objects.equals(t.getType(), "adminToCFO")))
            ).toList();
        }

        if (AllpersonId != null){
            Long personId = allidService.getTableId(AllpersonId);

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
                ? new ResponseEntity<>(transactions.stream().map(t -> new TransactionReq(t, cfoService, personService, allidService)).collect(Collectors.toList()), HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Operation(summary = "Просмотр бюджета по всем цфо", security = {@SecurityRequirement(name = "bearer-key")})
    @GetMapping("/allCfo")
    public ResponseEntity<AllCfoReq> allCfo() {
        Person pers = loginOfOwner();
        if (pers == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<CFO> cfoes = cfoService.getAll().stream().filter(c -> Objects.equals(c.getOwnerId(), pers.getId())).toList();

        return new ResponseEntity<>(new AllCfoReq(cfoes), HttpStatus.OK);
    }

    @Operation(summary = "Просмотр объекта для владельца, отображает только свою страницу и свои ЦФО, всё остальное 404 по ID", security = {@SecurityRequirement(name = "bearer-key")})
    @GetMapping("/ownerObjectByID")
    public ResponseEntity<OwnerObjectReq> ownerObjectByID(Long AllId) {
        Person pers = loginOfOwner();
        if (pers == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (Objects.equals(AllId, allidService.getALLId(pers.getId(), "person"))) {
            return new ResponseEntity<>(new OwnerObjectReq(null, null, pers, allidService, personService), HttpStatus.OK);
        }

        ALLID obj = allidService.getById(AllId);
        if (obj == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        CFO cfo = null;
        if (Objects.equals(obj.getTypeId(), "cfo"))
            cfo = cfoService.getById(allidService.getTableId(AllId));
        if (cfo == null || !Objects.equals(cfo.getOwnerId(), pers.getId())){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(new OwnerObjectReq(obj, cfo, null, allidService, personService), HttpStatus.OK);
    }

    @Operation(summary = "Просмотр объекта для владельца, отображает только свою страницу, всё остальное 404 по Логину", security = {@SecurityRequirement(name = "bearer-key")})
    @GetMapping("/ownerObjectByLog")
    public ResponseEntity<OwnerObjectReq> ownerObjectByLog(String Log) {
        Person pers = loginOfOwner();
        if (pers == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (!Objects.equals(pers.getLogin(), Log)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(new OwnerObjectReq(null, null, pers, allidService, personService), HttpStatus.OK);
    }

    private Person loginOfOwner(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        final String id = userDetails.getUsername();
        Person pers = personService.getById( Long.parseLong(id));
        if (Objects.equals(pers.getRole(), "owner")){
            return pers;
        }
        return null;
    }
}
