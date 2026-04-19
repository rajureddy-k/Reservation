package com.movie.payment.controller;

import com.movie.payment.dto.PaymentRequest;
import com.movie.payment.dto.PaymentResponse;
import com.movie.payment.service.PaymentService;
import com.stripe.exception.StripeException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(@Valid @RequestBody PaymentRequest paymentRequest) throws StripeException {
        PaymentResponse response = paymentService.processPayment(paymentRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
