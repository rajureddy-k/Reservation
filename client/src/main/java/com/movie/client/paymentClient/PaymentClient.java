package com.movie.client.paymentClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "payment")
public interface PaymentClient {

    @PostMapping("/api/v1/payments")
    PaymentResponse createPayment(@RequestBody PaymentRequest request);

    public static final class PaymentRequest {
        private Long scheduleId;
        private Long ticketId;
        private Long amount;
        private String currency;
        private String description;
        private String cardNumber;
        private Integer expMonth;
        private Integer expYear;
        private String cvc;

        public Long getScheduleId() { return scheduleId; }
        public void setScheduleId(Long scheduleId) { this.scheduleId = scheduleId; }
        public Long getTicketId() { return ticketId; }
        public void setTicketId(Long ticketId) { this.ticketId = ticketId; }
        public Long getAmount() { return amount; }
        public void setAmount(Long amount) { this.amount = amount; }
        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getCardNumber() { return cardNumber; }
        public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }
        public Integer getExpMonth() { return expMonth; }
        public void setExpMonth(Integer expMonth) { this.expMonth = expMonth; }
        public Integer getExpYear() { return expYear; }
        public void setExpYear(Integer expYear) { this.expYear = expYear; }
        public String getCvc() { return cvc; }
        public void setCvc(String cvc) { this.cvc = cvc; }
    }

    public static final class PaymentResponse {
        private String paymentId;
        private String status;
        private Long amount;
        private String currency;
        private String message;

        public String getPaymentId() { return paymentId; }
        public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public Long getAmount() { return amount; }
        public void setAmount(Long amount) { this.amount = amount; }
        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
