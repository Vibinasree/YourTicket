package com.yourticket.kafka;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class SeatBookedProducer {

    private static final String TOPIC = "seat-booked";

    @Autowired
    private KafkaTemplate<String, SeatBookedEvent> kafkaTemplate;

    public void publish(SeatBookedEvent event) {
        kafkaTemplate.send(TOPIC, String.valueOf(event.getSeatId()), event);
    }
}