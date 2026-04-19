package com.movie.payment.dto;

public record PaymentResponse(
        String paymentId,
        String status,
        Long amount,
        String currency,
        String message
) {
}
