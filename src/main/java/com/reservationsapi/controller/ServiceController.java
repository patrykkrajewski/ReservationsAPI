package com.reservationsapi.controller;

import com.reservationsapi.model.Service;
import com.reservationsapi.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    @GetMapping
    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable Long id) {
        Optional<Service> service = serviceRepository.findById(id);
        if (service.isPresent()) {
            return ResponseEntity.ok(service.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Service createService(@RequestBody Service service) {
        service.setCreatedAt(LocalDateTime.now());
        service.setUpdatedAt(LocalDateTime.now());
        return serviceRepository.save(service);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Service> updateService(@PathVariable Long id, @RequestBody Service serviceDetails) {
        Optional<Service> serviceOptional = serviceRepository.findById(id);
        if (serviceOptional.isPresent()) {
            Service service = serviceOptional.get();
            service.setName(serviceDetails.getName());
            service.setDescription(serviceDetails.getDescription());
            service.setPrice(serviceDetails.getPrice());
            service.setDuration(serviceDetails.getDuration());
            service.setUpdatedAt(LocalDateTime.now());
            Service updatedService = serviceRepository.save(service);
            return ResponseEntity.ok(updatedService);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        if (serviceRepository.existsById(id)) {
            serviceRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
