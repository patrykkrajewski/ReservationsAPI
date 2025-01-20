package com.reservationsapi.repository;

import com.reservationsapi.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByEmployeeId(Long employeeId);
    List<Reservation> findByUserId(Long userId);
    List<Reservation> findByStatusId(Long statusId);
    List<Reservation> findByDateBetween(LocalDateTime startOfDay, LocalDateTime endOfDay);
    List<Reservation> findByEmployeeIdAndDateBetween(Long employeeId, LocalDateTime startOfDay, LocalDateTime endOfDay);
}
