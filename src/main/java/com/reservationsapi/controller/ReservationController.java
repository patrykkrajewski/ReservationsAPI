package com.reservationsapi.controller;

import com.reservationsapi.model.Reservation;
import com.reservationsapi.model.Service;
import com.reservationsapi.model.User;
import com.reservationsapi.repository.ReservationRepository;
import com.reservationsapi.repository.ServiceRepository;
import com.reservationsapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ServiceRepository serviceRepository;

    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) {
        return reservationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).build());
    }
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateReservationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Long> payload) {
        System.out.println("Received request to update status for reservation ID: " + id);
        System.out.println("Payload: " + payload);

        Optional<Reservation> reservationOptional = reservationRepository.findById(id);
        if (reservationOptional.isPresent()) {
            Reservation reservation = reservationOptional.get();
            Long statusId = payload.get("statusId");
            if (statusId != null) {
                reservation.setStatusId(statusId);
                reservation.setUpdatedAt(LocalDateTime.now());
                reservationRepository.save(reservation);
                return ResponseEntity.ok("Status updated successfully");
            } else {
                return ResponseEntity.badRequest().body("statusId is required");
            }
        } else {
            return ResponseEntity.status(404).body("Reservation not found");
        }
    }
    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody Reservation reservation) {
        if (reservation.getUserId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User ID must not be null");
        }
        if (reservation.getEmployeeId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Employee ID must not be null");
        }
        if (reservation.getServiceId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Service ID must not be null");
        }

        reservation.setStatusId(3L);
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setUpdatedAt(LocalDateTime.now());

        try {
            Reservation savedReservation = reservationRepository.save(reservation);
            return ResponseEntity.ok(savedReservation);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Błąd podczas tworzenia rezerwacji: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReservation(@PathVariable Long id, @RequestBody Reservation reservationDetails) {
        Optional<Reservation> reservationOptional = reservationRepository.findById(id);
        if (reservationOptional.isPresent()) {
            Reservation reservation = reservationOptional.get();
            reservation.setUserId(reservationDetails.getUserId());
            reservation.setEmployeeId(reservationDetails.getEmployeeId());
            reservation.setServiceId(reservationDetails.getServiceId());
            reservation.setStatusId(reservationDetails.getStatusId());
            reservation.setDate(reservationDetails.getDate());
            reservation.setUpdatedAt(LocalDateTime.now());

            Reservation updatedReservation = reservationRepository.save(reservation);

            return ResponseEntity.ok(updatedReservation);
        } else {
            return ResponseEntity.status(404).body("Reservation not found");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        if (reservationRepository.existsById(id)) {
            reservationRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/by-employee/{employeeId}")
    public List<Reservation> getReservationsByEmployeeId(@PathVariable Long employeeId) {
        return reservationRepository.findByEmployeeId(employeeId);
    }

    @GetMapping("/by-user/{userId}")
    public List<Map<String, Object>> getReservationsByUserId(@PathVariable Long userId) {
        return reservationRepository.findByUserId(userId)
                .stream()
                .map(reservation -> {
                    Map<String, Object> reservationData = new HashMap<>();
                    reservationData.put("id", reservation.getId());
                    reservationData.put("date", reservation.getDate());
                    reservationData.put("status", reservation.getStatus() != null ? reservation.getStatus().getName() : "Brak statusu");
                    reservationData.put("serviceName", reservation.getService() != null ? reservation.getService().getName() : "Nieokreślona usługa");
                    reservationData.put("employeeName", reservation.getEmployeeId() != null ?
                            userRepository.findById(reservation.getEmployeeId())
                                    .map(User::getName)
                                    .orElse("Nieznany pracownik")
                            : "Nieznany pracownik");
                    return reservationData;
                })
                .collect(Collectors.toList());
    }


    @GetMapping("/by-status/{statusId}")
    public List<Reservation> getReservationsByStatusId(@PathVariable Long statusId) {
        return reservationRepository.findByStatusId(statusId);
    }

    @GetMapping("/by-employee/{employeeId}/date/{date}")
    public List<Map<String, Object>> getReservationsByEmployeeAndDate(
            @PathVariable Long employeeId,
            @PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        LocalDateTime startOfDay = localDate.atStartOfDay();
        LocalDateTime endOfDay = localDate.atTime(LocalTime.MAX);

        return reservationRepository.findByEmployeeIdAndDateBetween(employeeId, startOfDay, endOfDay)
                .stream()
                .map(reservation -> {
                    Map<String, Object> reservationData = new HashMap<>();
                    reservationData.put("id", reservation.getId());
                    reservationData.put("date", reservation.getDate());
                    reservationData.put("status", reservation.getStatus() != null ? reservation.getStatus().getName() : "Brak statusu");
                    reservationData.put("serviceName", reservation.getService() != null ? reservation.getService().getName() : "Nieokreślona usługa");
                    reservationData.put("userName", reservation.getUser() != null ? reservation.getUser().getFullName() : "Nieznany klient");
                    return reservationData;
                })
                .collect(Collectors.toList());
    }


    @GetMapping("/available-times/{employeeId}/{date}")
    public List<LocalTime> getAvailableTimes(
            @PathVariable Long employeeId,
            @PathVariable String date
    ) {
        LocalDate localDate = LocalDate.parse(date);
        LocalDateTime startOfDay = localDate.atStartOfDay();
        LocalDateTime endOfDay = localDate.atTime(LocalTime.MAX);

        List<Reservation> reservations = reservationRepository.findByEmployeeIdAndDateBetween(employeeId, startOfDay, endOfDay);

        List<LocalTime> bookedTimes = reservations.stream()
                .flatMap(reservation -> {
                    LocalTime startTime = reservation.getDate().toLocalTime();
                    int duration = serviceRepository.findById(reservation.getServiceId())
                            .map(Service::getDuration)
                            .orElse(0);

                    LocalTime endTime = startTime.plusMinutes(duration);

                    return Stream.iterate(startTime, time -> time.plusMinutes(30))
                            .takeWhile(time -> time.isBefore(endTime))
                            .collect(Collectors.toList())
                            .stream();
                })
                .collect(Collectors.toList());

        LocalTime workStart = LocalTime.of(8, 0);
        LocalTime workEnd = LocalTime.of(16, 0);
        List<LocalTime> allTimes = Stream.iterate(workStart, time -> time.plusMinutes(30))
                .takeWhile(time -> !time.isAfter(workEnd))
                .collect(Collectors.toList());

        return allTimes.stream()
                .filter(time -> !bookedTimes.contains(time))
                .collect(Collectors.toList());
    }
    @GetMapping("/by-employee/{employeeId}/day")
    public List<Reservation> getReservationsByEmployeeForDay(
            @PathVariable Long employeeId,
            @RequestParam("date") String date) {
        LocalDate localDate = LocalDate.parse(date);
        LocalDateTime startOfDay = localDate.atStartOfDay();
        LocalDateTime endOfDay = localDate.atTime(LocalTime.MAX);
        return reservationRepository.findByEmployeeIdAndDateBetween(employeeId, startOfDay, endOfDay);
    }
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateReservationStatus(
            @PathVariable Long id,
            @RequestParam("status") Long statusId) {
        Optional<Reservation> reservationOptional = reservationRepository.findById(id);
        if (reservationOptional.isPresent()) {
            Reservation reservation = reservationOptional.get();
            reservation.setStatusId(statusId);
            reservation.setUpdatedAt(LocalDateTime.now());
            reservationRepository.save(reservation);
            return ResponseEntity.ok("Status updated successfully");
        } else {
            return ResponseEntity.status(404).body("Reservation not found");
        }
    }

    @GetMapping("/available-employees/{date}")
    public List<User> getAvailableEmployees(@PathVariable String date) {
        return userRepository.findByRoleId(2L);
    }
}
