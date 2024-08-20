package com.example.demo.Service;

import com.auth0.jwt.algorithms.Algorithm;
import com.example.demo.BDData.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.auth0.jwt.JWT;

import java.util.Date;
import java.util.Objects;

@Service
public class AuthService {

    @Autowired
    private PersonService persService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Value("${security.jwt.secret-key}")
    private String secretKey;

    @Value("${security.jwt.expiration-time}")
    long jwtExpiration;



    public String login(String login, String password) {
        boolean persIs = persService.getAll().stream().anyMatch(p -> Objects.equals(p.getLogin(), login));
        if (!persIs){
            throw new UsernameNotFoundException("User " + login + " not found.");
        }

        Person pers = persService.getAll().stream().filter(p -> Objects.equals(p.getLogin(), login)).findFirst().get();

        if (!Objects.equals(pers.getPassword(), password)){
            throw new UsernameNotFoundException("Password not true.");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        pers.getId().toString(),
                        pers.getPassword()
                )
        );

        return JWT.create()
                .withSubject(pers.getId().toString())
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + jwtExpiration))
                .sign(Algorithm.HMAC256(secretKey));
    }

    public String newToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        final String id = userDetails.getUsername();
        return JWT.create()
                .withSubject(id)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + jwtExpiration))
                .sign(Algorithm.HMAC256(secretKey));
    }

}
