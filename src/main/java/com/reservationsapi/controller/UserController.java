package com.reservationsapi.controller;

import com.reservationsapi.model.User;
import com.reservationsapi.repository.RoleRepository;
import com.reservationsapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRoleId() != 2)
                .map(user -> {
                    String roleName = roleRepository.findById(user.getRoleId())
                            .map(role -> role.getName())
                            .orElse("Nieznany");
                    return new UserResponse(user.getId(), user.getName(), user.getEmail(), roleName, user.getCreatedAt().toLocalDate());
                })
                .collect(Collectors.toList());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isPresent()) {
            userRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Użytkownik został pomyślnie usunięty"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Nie znaleziono użytkownika o podanym ID"));
        }
    }

    @GetMapping("/employees")
    public List<UserResponse> getAllEmployees() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRoleId() == 2)
                .map(user -> {
                    String roleName = roleRepository.findById(user.getRoleId())
                            .map(role -> role.getName())
                            .orElse("Nieznany");
                    return new UserResponse(user.getId(), user.getName(), user.getEmail(), roleName, user.getCreatedAt().toLocalDate());
                })
                .collect(Collectors.toList());
    }
    @GetMapping("/admins")
    public ResponseEntity<?> getAllAdmins(@RequestParam(value = "userId", required = false) Long userId) {
        if (userId != null) {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                String roleName = roleRepository.findById(user.getRoleId())
                        .map(role -> role.getName())
                        .orElse("Nieznany");
                if (user.getRoleId() == 1) {
                    UserResponse userResponse = new UserResponse(
                            user.getId(),
                            user.getName(),
                            user.getEmail(),
                            roleName,
                            user.getCreatedAt().toLocalDate()
                    );
                    return ResponseEntity.ok(userResponse);
                } else {
                    return ResponseEntity.ok(Map.of(
                            "id", user.getId(),
                            "name", user.getName(),
                            "email", user.getEmail(),
                            "role", roleName,
                            "message", "Użytkownik nie jest administratorem"
                    ));
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Nie znaleziono użytkownika o podanym ID"));
            }
        } else {
            List<UserResponse> admins = userRepository.findAll().stream()
                    .filter(user -> user.getRoleId() == 1) // Filter users with roleId == 1 (Admin)
                    .map(user -> {
                        String roleName = roleRepository.findById(user.getRoleId())
                                .map(role -> role.getName())
                                .orElse("Nieznany");
                        return new UserResponse(
                                user.getId(),
                                user.getName(),
                                user.getEmail(),
                                roleName,
                                user.getCreatedAt().toLocalDate()
                        );
                    })
                    .collect(Collectors.toList());
            return ResponseEntity.ok(admins);
        }
    }

    @PostMapping("/employees")
    public ResponseEntity<User> createEmployee(@RequestBody User userDetails) {
        userDetails.setRoleId(2L);
        userDetails.setCreatedAt(LocalDateTime.now());
        userDetails.setUpdatedAt(LocalDateTime.now());
        User savedUser = userRepository.save(userDetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setName(userDetails.getName());
            user.setEmail(userDetails.getEmail());

            if (userDetails.getRoleId() != null && roleRepository.existsById(userDetails.getRoleId())) {
                user.setRoleId(userDetails.getRoleId());
            }

            user.setUpdatedAt(LocalDateTime.now());
            User updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User userDetails) {
        if (userDetails.getRoleId() == null) {
            userDetails.setRoleId(4L);
        }
        userDetails.setCreatedAt(LocalDateTime.now());
        userDetails.setUpdatedAt(LocalDateTime.now());
        User savedUser = userRepository.save(userDetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String roleName = roleRepository.findById(user.getRoleId())
                    .map(role -> role.getName())
                    .orElse("Nieznany");
            UserResponse userResponse = new UserResponse(user.getId(), user.getName(), user.getEmail(), roleName, user.getCreatedAt().toLocalDate());
            return ResponseEntity.ok(userResponse);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (user.getPassword().equals(loginRequest.getPassword())) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "username", user.getName(),
                        "message", "Zalogowano pomyślnie",
                        "userId", user.getId() // Dodano userId
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of(
                                "success", false,
                                "username", null,
                                "message", "Nieprawidłowe hasło",
                                "userId", null
                        ));
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "success", false,
                            "username", null,
                            "message", "Użytkownik nie istnieje",
                            "userId", null
                    ));
        }
    }


    public static class UserResponse {
        private Long id;
        private String name;
        private String email;
        private String role;
        private LocalDate createdAt;

        public UserResponse(Long id, String name, String email, String role, LocalDate createdAt) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
            this.createdAt = createdAt;
        }

        public Long getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public String getEmail() {
            return email;
        }

        public String getRole() {
            return role;
        }

        public LocalDate getCreatedAt() {
            return createdAt;
        }
    }

    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class LoginResponse {
        private boolean success;
        private String username;
        private String message;

        public LoginResponse(boolean success, String username, String message) {
            this.success = success;
            this.username = username;
            this.message = message;
        }

        public boolean isSuccess() {
            return success;
        }

        public String getUsername() {
            return username;
        }

        public String getMessage() {
            return message;
        }
    }
}
