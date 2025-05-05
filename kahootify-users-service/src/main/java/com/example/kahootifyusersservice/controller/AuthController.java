package com.example.kahootifyusersservice.controller;

import com.example.kahootifyusersservice.dto.request.AuthRequest;
import com.example.kahootifyusersservice.dto.response.AuthResponse;
import com.example.kahootifyusersservice.enums.Role;
import com.example.kahootifyusersservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody AuthRequest request,
                                    @RequestParam Role role) {
        userService.signup(request, role);
        return ResponseEntity.ok("User registered");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }
}

