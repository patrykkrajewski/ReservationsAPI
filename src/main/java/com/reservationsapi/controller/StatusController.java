package com.reservationsapi.controller;

import com.reservationsapi.model.Status;
import com.reservationsapi.repository.StatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/statuses")
public class StatusController {

    @Autowired
    private StatusRepository statusRepository;

    @GetMapping
    public List<Status> getAllStatuses() {
        return statusRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Status> getStatusById(@PathVariable Long id) {
        Optional<Status> status = statusRepository.findById(id);
        if (status.isPresent()) {
            return ResponseEntity.ok(status.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Status createStatus(@RequestBody Status status) {
        status.setCreatedAt(LocalDateTime.now());
        status.setUpdatedAt(LocalDateTime.now());
        return statusRepository.save(status);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Status> updateStatus(@PathVariable Long id, @RequestBody Status statusDetails) {
        Optional<Status> statusOptional = statusRepository.findById(id);
        if (statusOptional.isPresent()) {
            Status status = statusOptional.get();
            status.setName(statusDetails.getName());
            status.setColor(statusDetails.getColor());
            status.setUpdatedAt(LocalDateTime.now());
            Status updatedStatus = statusRepository.save(status);
            return ResponseEntity.ok(updatedStatus);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStatus(@PathVariable Long id) {
        if (statusRepository.existsById(id)) {
            statusRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
