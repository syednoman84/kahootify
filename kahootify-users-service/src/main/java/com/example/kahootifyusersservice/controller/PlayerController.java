package com.example.kahootifyusersservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/player")
public class PlayerController {

    @GetMapping("/profile")
    public ResponseEntity<String> getPlayerProfile() {
        return ResponseEntity.ok("Welcome to Player Profile");
    }
}
