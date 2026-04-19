package com.movie.payment.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class StripeConfig {

    @Value("${stripe.api-key:}")
    private String apiKey;

    @Value("${stripe.mock:true}")
    private boolean mock;

    public String getApiKey() {
        return apiKey;
    }

    public boolean isMock() {
        return mock;
    }
}
