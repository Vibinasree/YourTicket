package com.yourticket.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class SeatBookedConsumers {

    @KafkaListener(topics = "seat-booked", groupId = "payment-service")
    public void processPayment(SeatBookedEvent event) {
        // Charge event.getAmount() for event.getUserId(). Stub for now.
        System.out.println("Processing payment for booking " + event.getBookingId());
    }

    @KafkaListener(topics = "seat-booked", groupId = "notification-service")
    public void sendConfirmation(SeatBookedEvent event) {
        // Send email/SMS confirmation. Stub for now.
        System.out.println("Sending confirmation for booking " + event.getBookingId());
    }
}