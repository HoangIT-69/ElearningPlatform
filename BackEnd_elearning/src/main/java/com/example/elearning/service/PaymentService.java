package com.example.elearning.service;

import com.example.elearning.config.VnpayConfig;
import com.example.elearning.entity.Enrollment;
import com.example.elearning.entity.Order;
import com.example.elearning.entity.Transaction;
import com.example.elearning.exception.AppException;
import com.example.elearning.repository.CartRepository;
import com.example.elearning.repository.EnrollmentRepository;
import com.example.elearning.repository.OrderRepository;
import com.example.elearning.repository.TransactionRepository;
import com.example.elearning.security.UserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class PaymentService {

    @Autowired private OrderService orderService;
    @Autowired private TransactionRepository transactionRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private EnrollmentRepository enrollmentRepository;
    @Autowired private CartRepository cartRepository;

    @Transactional
    public String createVnpayPayment(HttpServletRequest request, UserPrincipal currentUser) throws UnsupportedEncodingException {
        // 1. Tạo đơn hàng từ giỏ hàng để lấy ID và tổng số tiền
        Order order = orderService.createOrderFromCart(currentUser);

        // 2. Kiểm tra xem tổng tiền có lớn hơn 0 không
        if (order.getTotalAmount().compareTo(BigDecimal.ZERO) > 0) {
            // ----- TRƯỜNG HỢP CÓ TÍNH PHÍ: TẠO LINK VNPAY -----
            long amount = order.getTotalAmount().longValue() * 100;
            String vnp_TxnRef = String.valueOf(order.getId());
            String vnp_IpAddr = VnpayConfig.getIpAddress(request);

            // Tạo Transaction log với trạng thái PENDING
            Transaction transaction = new Transaction();
            transaction.setOrderId(order.getId());
            transaction.setUserId(currentUser.getId());
            transaction.setAmount(order.getTotalAmount());
            transaction.setPaymentMethod("VNPAY");
            transaction.setStatus("PENDING");
            transaction.setTransactionCode(vnp_TxnRef);
            transactionRepository.save(transaction);

            // Xây dựng các tham số để gửi cho VNPay
            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", VnpayConfig.vnp_Version);
            vnp_Params.put("vnp_Command", "pay");
            vnp_Params.put("vnp_TmnCode", VnpayConfig.vnp_TmnCode);
            vnp_Params.put("vnp_Amount", String.valueOf(amount));
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang #" + vnp_TxnRef);
            vnp_Params.put("vnp_OrderType", "other");
            vnp_Params.put("vnp_Locale", "vn");

            // URL này là nơi VNPay sẽ gửi kết quả về cho backend của bạn
            String returnUrl = "https://darlene-chlamydeous-tanika.ngrok-free.dev/api/payment/vnpay-return";
            vnp_Params.put("vnp_ReturnUrl", returnUrl);
            vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnp_CreateDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
            cld.add(Calendar.MINUTE, 15);
            String vnp_ExpireDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

            List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = vnp_Params.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                }
            }

            String queryUrl = query.toString();
            String vnp_SecureHash = VnpayConfig.hmacSHA512(VnpayConfig.vnp_HashSecret, hashData.toString());
            queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;

            return VnpayConfig.vnp_PayUrl + "?" + queryUrl;

        } else {
            // ----- TRƯỜNG HỢP MIỄN PHÍ: HOÀN TẤT ĐƠN HÀNG NGAY LẬP TỨC -----
            order.setStatus("COMPLETED");

            order.getOrderItems().forEach(item -> {
                if (!enrollmentRepository.existsByStudentIdAndCourseId(order.getUserId(), item.getCourseId())) {
                    Enrollment enrollment = new Enrollment(order.getUserId(), item.getCourseId());
                    enrollmentRepository.save(enrollment);
                }
            });

            Transaction transaction = new Transaction();
            transaction.setOrderId(order.getId());
            transaction.setUserId(currentUser.getId());
            transaction.setAmount(BigDecimal.ZERO);
            transaction.setPaymentMethod("FREE");
            transaction.setStatus("SUCCESS");
            transaction.setTransactionCode("FREE-" + order.getId());
            transactionRepository.save(transaction);

            cartRepository.deleteAllByUserId(order.getUserId());

            orderRepository.save(order);

            // Trả về URL của trang thành công trên frontend
            return "http://localhost:5173/payment-success?orderId=" + order.getId() + "&free=true";
        }
    }

    @Transactional
    public boolean handleVnpayReturn(Map<String, String> params) {
        String vnp_SecureHash = params.get("vnp_SecureHash");
        params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        // Sắp xếp các tham số và tạo lại chuỗi hash để xác thực
        Map<String, String> sortedParams = new TreeMap<>(params);
        StringBuilder hashData = new StringBuilder();
        for (Map.Entry<String, String> entry : sortedParams.entrySet()) {
            hashData.append(entry.getKey());
            hashData.append('=');
            try {
                hashData.append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII.toString()));
            } catch (UnsupportedEncodingException e) {
                // Handle exception
            }
            hashData.append('&');
        }
        hashData.setLength(hashData.length() - 1);
        String calculatedHash = VnpayConfig.hmacSHA512(VnpayConfig.vnp_HashSecret, hashData.toString());

        // 1. Xác thực chữ ký
        if (!calculatedHash.equals(vnp_SecureHash)) {
            System.err.println("VNPay checksum failed!");
            return false; // Chữ ký không hợp lệ, bỏ qua
        }

        String responseCode = params.get("vnp_ResponseCode");
        String orderIdStr = params.get("vnp_TxnRef");
        Long orderId = Long.parseLong(orderIdStr);

        // 2. Tìm Order và Transaction trong DB
        Order order = orderRepository.findById(orderId).orElse(null);
        Transaction transaction = transactionRepository.findByTransactionCode(orderIdStr).orElse(null);

        if (order == null || transaction == null) {
            System.err.println("Order or Transaction not found for ID: " + orderIdStr);
            return false; // Không tìm thấy đơn hàng
        }

        // 3. Kiểm tra xem đơn hàng đã được xử lý chưa
        if (!"PENDING".equals(order.getStatus())) {
            System.err.println("Order already processed: " + orderIdStr);
            return true; // Đơn hàng đã được xử lý trước đó, vẫn coi là thành công
        }

        if ("00".equals(responseCode)) {
            // Thanh toán thành công
            System.out.println("Payment success for Order ID: " + orderIdStr);
            order.setStatus("COMPLETED");
            transaction.setStatus("SUCCESS");

            // Tạo Enrollment cho từng khóa học trong đơn hàng
            order.getOrderItems().forEach(item -> {
                // Kiểm tra xem đã tồn tại enrollment chưa để tránh lỗi
                if (!enrollmentRepository.existsByStudentIdAndCourseId(order.getUserId(), item.getCourseId())) {
                    Enrollment enrollment = new Enrollment(order.getUserId(), item.getCourseId());
                    enrollmentRepository.save(enrollment);
                }
            });

            // Dọn dẹp giỏ hàng của người dùng
            cartRepository.deleteAllByUserId(order.getUserId());

            orderRepository.save(order);
            transactionRepository.save(transaction);

            return true; // Báo thành công
        } else {
            // Thanh toán thất bại
            System.out.println("Payment failed for Order ID: " + orderIdStr);
            order.setStatus("FAILED");
            transaction.setStatus("FAILED");

            orderRepository.save(order);
            transactionRepository.save(transaction);

            return false; // Báo thất bại
        }
    }
}