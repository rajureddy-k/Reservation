package com.movie.payment.service;

import com.movie.payment.config.StripeConfig;
import com.movie.payment.dto.PaymentRequest;
import com.movie.payment.dto.PaymentResponse;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.Token;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    private final StripeConfig stripeConfig;

    public PaymentService(StripeConfig stripeConfig) {
        this.stripeConfig = stripeConfig;
    }

    public PaymentResponse processPayment(PaymentRequest request) throws StripeException {
        if (stripeConfig.isMock()) {
            return createMockResponse(request);
        }

        if (stripeConfig.getApiKey() == null || stripeConfig.getApiKey().isBlank()) {
            throw new IllegalStateException("Stripe API key is not configured. Set stripe.api-key in application.yml or environment variables.");
        }

        Stripe.apiKey = stripeConfig.getApiKey();

        Map<String, Object> card = new HashMap<>();
        card.put("number", request.getCardNumber());
        card.put("exp_month", request.getExpMonth());
        card.put("exp_year", request.getExpYear());
        card.put("cvc", request.getCvc());

        Map<String, Object> tokenParams = new HashMap<>();
        tokenParams.put("card", card);
        Token cardToken = Token.create(tokenParams);

        Map<String, Object> chargeParams = new HashMap<>();
        chargeParams.put("amount", request.getAmount());
        chargeParams.put("currency", request.getCurrency());
        chargeParams.put("description", request.getDescription());
        chargeParams.put("source", cardToken.getId());

        Charge charge = Charge.create(chargeParams);

        return new PaymentResponse(
                charge.getId(),
                charge.getStatus(),
                charge.getAmount(),
                charge.getCurrency(),
                "Stripe payment " + charge.getStatus()
        );
    }

    private PaymentResponse createMockResponse(PaymentRequest request) {
        return new PaymentResponse(
                "mock_" + System.currentTimeMillis(),
                "succeeded",
                request.getAmount(),
                request.getCurrency(),
                "Mock payment accepted. Use Stripe test card 4242 4242 4242 4242 when stripe.mock=false"
        );
    }
}
