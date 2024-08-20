package com.example.demo.Controllers;

import com.example.demo.BDData.Person;
import com.example.demo.Data.PersonSumReq;
import com.example.demo.Config.Sha256;
import com.example.demo.Service.AuthService;
import com.example.demo.Service.PersonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Objects;

@Tag(name="Контроллер Авторизации")
@RestController
public class AuthController {
    @Autowired
    private AuthService authService;

    @Autowired
    private PersonService personService;

    @Operation(summary = "Получить токен (действителен 20 минут)")
    @PostMapping("/login")
    public ResponseEntity<String> login(String login, String password) {
        final String accessToken = authService.login(login, Sha256.sha256(password) );

        return new ResponseEntity<>(accessToken, HttpStatus.OK);
    }

    @Operation(summary = "Получить обновленный токен (действителен 20 минут)", security = {@SecurityRequirement(name = "bearer-key")})
    @PostMapping("/newToken")
    public ResponseEntity<String> newToken() {
        final String accessToken = authService.newToken();

        return new ResponseEntity<>(accessToken, HttpStatus.OK);
    }

    @Operation(summary = "Просмотр своего аккаунта", security = {@SecurityRequirement(name = "bearer-key")})
    @GetMapping("/profile")
    public ResponseEntity<PersonSumReq> profile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        final String id = userDetails.getUsername();

        Person pers = personService.getById(Long.parseLong(id));
        if (pers == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(new PersonSumReq(pers), HttpStatus.OK);
    }

    @Operation(summary = "Регистрация пользователя (возврашает токен для входа)")
    @PostMapping("/registration")
    public ResponseEntity<String> registration(String login, String password) {
        boolean persIs = personService.getAll().stream().anyMatch(p -> Objects.equals(p.getLogin(), login));
        if (persIs){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        String hashPass = Sha256.sha256(password);
        Person pers = new Person();
        pers.setSum(0);
        pers.setRole("user");
        pers.setLogin(login);
        pers.setPassword(hashPass);
        personService.create(pers);

        final String accessToken = authService.login(login, hashPass);
        return new ResponseEntity<>(accessToken, HttpStatus.OK);
    }

}
