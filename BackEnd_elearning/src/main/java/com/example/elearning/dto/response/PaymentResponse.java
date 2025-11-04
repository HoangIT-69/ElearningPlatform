package com.example.elearning.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentResponse {
    private String status;
    private String message;
    private String paymentUrl;
}