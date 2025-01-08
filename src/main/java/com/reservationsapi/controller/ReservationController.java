package com.reservationsapi.controller;

import com.reservationsapi.model.Reservation;
import com.reservationsapi.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) {
        Optional<Reservation> reservation = reservationRepository.findById(id);
        if (reservation.isPresent()) {
            return ResponseEntity.ok(reservation.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Reservation createReservation(@RequestBody Reservation reservation) {
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setUpdatedAt(LocalDateTime.now());
        return reservationRepository.save(reservation);
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

                System.out.println("Rezerwacja zaktualizowana: " + updatedReservation);

                return ResponseEntity.ok(updatedReservation);
            } else {
                System.out.println("Rezerwacja o ID " + id + " nie została znaleziona.");
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
    public List<Reservation> getReservationsByUserId(@PathVariable Long userId) {
        return reservationRepository.findByUserId(userId);
    }

    @GetMapping("/by-status/{statusId}")
    public List<Reservation> getReservationsByStatusId(@PathVariable Long statusId) {
        return reservationRepository.findByStatusId(statusId);
    }

    @GetMapping("/by-employee/{employeeId}/date/{date}")
    public List<Reservation> getReservationsByEmployeeAndDate(@PathVariable Long employeeId, @PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        LocalDateTime startOfDay = localDate.atStartOfDay();
        LocalDateTime endOfDay = localDate.atTime(LocalTime.MAX);
        return reservationRepository.findByEmployeeIdAndDateBetween(employeeId, startOfDay, endOfDay);
    }
}
