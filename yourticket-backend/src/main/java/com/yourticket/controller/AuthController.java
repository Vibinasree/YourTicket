package com.yourticket.controller;

import com.yourticket.model.User;
import com.yourticket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepository.findByEmail(req.email).isPresent()) {
            return ResponseEntity.status(409).body("Email already registered");
        }
        User user = new User();
        user.setName(req.name);
        user.setEmail(req.email);
        user.setPasswordHash(passwordEncoder.encode(req.password));
        userRepository.save(user);
        return ResponseEntity.ok().body("User registered");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        User user = userRepository.findByEmail(req.email).orElse(null);
        if (user == null || !passwordEncoder.matches(req.password, user.getPasswordHash())) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
        return ResponseEntity.ok().body(new LoginResponse(user.getId(), user.getName()));
    }

    public static class RegisterRequest {
        public String name, email, password;
    }
    public static class LoginRequest {
        public String email, password;
    }
    public static class LoginResponse {
        public Long userId;
        public String name;
        public LoginResponse(Long userId, String name) {
            this.userId = userId;
            this.name = name;
        }
    }
}