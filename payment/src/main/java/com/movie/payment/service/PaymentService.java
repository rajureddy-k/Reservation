package com.movie.payment.service;

import com.movie.payment.config.StripeConfig;
import com.movie.payment.dto.PaymentRequest;
import com.movie.payment.dto.PaymentResponse;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
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

        String source = resolvePaymentSource(request.getCardNumber(), stripeConfig.getApiKey());

        Map<String, Object> chargeParams = new HashMap<>();
        chargeParams.put("amount", request.getAmount());
        chargeParams.put("currency", request.getCurrency());
        chargeParams.put("description", request.getDescription());
        chargeParams.put("source", source);

        Charge charge = Charge.create(chargeParams);

        return new PaymentResponse(
                charge.getId(),
                charge.getStatus(),
                charge.getAmount(),
                charge.getCurrency(),
                "Stripe payment " + charge.getStatus()
        );

    }

    private String resolvePaymentSource(String cardNumberOrToken, String apiKey) {
        if (cardNumberOrToken != null && cardNumberOrToken.startsWith("tok_")) {
            return cardNumberOrToken;
        }

        if (apiKey != null && apiKey.startsWith("sk_test_")) {
            return "tok_visa";
        }

        throw new IllegalStateException(
                "Stripe raw card data is disabled. Use a Stripe token (tok_...) or set stripe.mock=true for mock payments."
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
