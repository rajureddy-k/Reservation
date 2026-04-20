package com.movie.exceptions;

import feign.Response;
import feign.codec.ErrorDecoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class CustomFeignErrorDecoder implements ErrorDecoder {

    private static final Logger log = LoggerFactory.getLogger(CustomFeignErrorDecoder.class);

    @Override
    public Exception decode(String methodKey, Response response) {
        String responseBody = null;
        try {
            if (response.body() != null) {
                responseBody = new String(response.body().asInputStream().readAllBytes(), StandardCharsets.UTF_8);
            }
        } catch (IOException e) {
            log.error("Failed to read response body", e);
        }

        log.error("HTTP {} received from Feign client for method [{}]. URL: {}, Body: {}",
                response.status(), methodKey, response.request().url(), responseBody);

            if (response.status() == HttpStatus.NOT_FOUND.value()) {
                return new ResourceNotFoundException("Resource not found: " + response.request().url());
            }

            if (response.status() == HttpStatus.FORBIDDEN.value()) {
                return new HandleRuntimeException("Access denied: " + response.request().url() + " - Body: " + responseBody);
            }

            return new Exception("Error calling external service: HTTP " + response.status() + ", Body: " + responseBody);
        }
    }

