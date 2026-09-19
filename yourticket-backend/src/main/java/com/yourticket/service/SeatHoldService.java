package com.yourticket.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class SeatHoldService {

    @Autowired
    private StringRedisTemplate redisTemplate;

    private String key(Long seatId) {
        return "seat:hold:" + seatId;
    }

    // Returns true if the soft hold was acquired
    public boolean tryHold(Long seatId, Long userId) {
        Boolean acquired = redisTemplate.opsForValue()
                .setIfAbsent(key(seatId), String.valueOf(userId), Duration.ofMinutes(5));
        return Boolean.TRUE.equals(acquired);
    }

    public void release(Long seatId) {
        redisTemplate.delete(key(seatId));
    }
}