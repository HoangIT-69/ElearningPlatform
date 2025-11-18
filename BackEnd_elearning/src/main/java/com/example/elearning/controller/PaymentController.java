
package com.example.elearning.controller;

import com.example.elearning.config.VnpayConfig;
import com.example.elearning.dto.response.ApiResponse;
import com.example.elearning.dto.response.PaymentResponse;
import com.example.elearning.entity.Order;
import com.example.elearning.entity.Transaction;
import com.example.elearning.repository.TransactionRepository;
import com.example.elearning.security.UserPrincipal;
import com.example.elearning.service.OrderService;
import com.example.elearning.service.PaymentService; // <-- Sẽ tạo service này
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private PaymentService paymentService; // Sử dụng PaymentService để xử lý logic

    @GetMapping("/create-payment")
    public ResponseEntity<ApiResponse<PaymentResponse>> createPayment(
            HttpServletRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) throws UnsupportedEncodingException {

        // Chỉ cần gọi service, service sẽ tự quyết định trả về link VNPay hay link thành công
        String paymentUrl = paymentService.createVnpayPayment(request, currentUser);

        PaymentResponse paymentResponse = new PaymentResponse("OK", "Xử lý thành công", paymentUrl);
        return ResponseEntity.ok(ApiResponse.success(paymentResponse));
    }

    @GetMapping("/vnpay-return")
    public RedirectView vnpayReturn(@RequestParam Map<String, String> params) {

        // Gọi service để xử lý kết quả
        boolean isSuccess = paymentService.handleVnpayReturn(params);

        String orderId = params.get("vnp_TxnRef");
        String frontendBaseUrl = "http://localhost:5173"; // Cấu hình URL frontend

        if (isSuccess) {
            return new RedirectView(frontendBaseUrl + "/payment-success?orderId=" + orderId);
        } else {
            return new RedirectView(frontendBaseUrl + "/payment-failed?orderId=" + orderId);
        }
    }
}
