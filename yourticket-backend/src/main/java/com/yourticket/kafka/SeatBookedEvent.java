package com.yourticket.kafka;

public class SeatBookedEvent {
    private Long bookingId;
    private Long seatId;
    private Long userId;
    private Long eventId;
    private Double amount;

    public SeatBookedEvent() {}

    public SeatBookedEvent(Long bookingId, Long seatId, Long userId, Long eventId, Double amount) {
        this.bookingId = bookingId;
        this.seatId = seatId;
        this.userId = userId;
        this.eventId = eventId;
        this.amount = amount;
    }

    public Long getBookingId() { return bookingId; }
    public Long getSeatId() { return seatId; }
    public Long getUserId() { return userId; }
    public Long getEventId() { return eventId; }
    public Double getAmount() { return amount; }
}