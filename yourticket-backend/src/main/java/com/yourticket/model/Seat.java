package com.yourticket.model;

import jakarta.persistence.*;

@Entity
@Table(name = "seats", uniqueConstraints = @UniqueConstraint(columnNames = {"event_id", "seat_code"}))
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long eventId;
    private String seatCode;       // e.g. "B12"

    @Enumerated(EnumType.STRING)
    private SeatTier tier;         // VVIP, VIP, REGULAR

    private Double price;

    @Enumerated(EnumType.STRING)
    private SeatStatus status;     // AVAILABLE, BOOKED

    private Long bookedByUserId;

    @Version
    private Long version;          // optimistic-lock fallback

    // getters and setters

    public Long getId() { return id; }
    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }
    public String getSeatCode() { return seatCode; }
    public void setSeatCode(String seatCode) { this.seatCode = seatCode; }
    public SeatTier getTier() { return tier; }
    public void setTier(SeatTier tier) { this.tier = tier; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public SeatStatus getStatus() { return status; }
    public void setStatus(SeatStatus status) { this.status = status; }
    public Long getBookedByUserId() { return bookedByUserId; }
    public void setBookedByUserId(Long bookedByUserId) { this.bookedByUserId = bookedByUserId; }
}