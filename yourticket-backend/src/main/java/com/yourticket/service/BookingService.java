package com.yourticket.service;

import com.yourticket.kafka.SeatBookedEvent;
import com.yourticket.kafka.SeatBookedProducer;
import com.yourticket.model.*;
import com.yourticket.repository.BookingRepository;
import com.yourticket.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class BookingService {

    @Autowired private SeatRepository seatRepository;
    @Autowired private BookingRepository bookingRepository;
    @Autowired private SeatBookedProducer producer;
    @Autowired private SeatHoldService seatHoldService;

    @Transactional
    public Booking confirmBooking(Long seatId, Long userId) {
        Seat seat = seatRepository.findByIdForUpdate(seatId)
                .orElseThrow(() -> new IllegalArgumentException("Seat not found"));

        if (seat.getStatus() != SeatStatus.AVAILABLE) {
            throw new IllegalStateException("Seat no longer available");
        }

        seat.setStatus(SeatStatus.BOOKED);
        seat.setBookedByUserId(userId);
        seatRepository.save(seat);

        Booking booking = new Booking();
        booking.setSeatId(seat.getId());
        booking.setUserId(userId);
        booking.setEventId(seat.getEventId());
        booking.setAmountPaid(seat.getPrice());
        booking.setBookedAt(Instant.now());
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        // Only publish after the transaction is about to commit successfully
        producer.publish(new SeatBookedEvent(
                booking.getId(), seat.getId(), userId, seat.getEventId(), seat.getPrice()));

        // Redis hold has no more purpose once the seat is truly booked
        seatHoldService.release(seatId);

        return booking;
    }
}