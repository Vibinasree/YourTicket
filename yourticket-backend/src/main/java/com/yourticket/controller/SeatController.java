package com.yourticket.controller;

import com.yourticket.model.Booking;
import com.yourticket.model.Seat;
import com.yourticket.repository.SeatRepository;
import com.yourticket.service.BookingService;
import com.yourticket.service.SeatHoldService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@CrossOrigin(origins = "*")
public class SeatController {

    @Autowired private SeatRepository seatRepository;
    @Autowired private SeatHoldService seatHoldService;
    @Autowired private BookingService bookingService;

    @GetMapping("/event/{eventId}")
    public List<Seat> getSeats(@PathVariable Long eventId) {
        return seatRepository.findByEventId(eventId);
    }

    @PostMapping("/{seatId}/hold")
    public ResponseEntity<?> hold(@PathVariable Long seatId, @RequestParam Long userId) {
        boolean acquired = seatHoldService.tryHold(seatId, userId);
        if (!acquired) {
            return ResponseEntity.status(409).body("Seat is currently held by another user");
        }
        return ResponseEntity.ok().body("Seat held for 5 minutes");
    }

    @PostMapping("/{seatId}/confirm")
    public ResponseEntity<?> confirm(@PathVariable Long seatId, @RequestParam Long userId) {
        try {
            Booking booking = bookingService.confirmBooking(seatId, userId);
            return ResponseEntity.ok(booking);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }
}