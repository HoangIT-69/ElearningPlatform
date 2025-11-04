# E-Learning Platform

Dự án tốt nghiệp - Nền tảng học trực tuyến.

## 🚀 Tech Stack

-   **Backend:** [Spring Boot](https://spring.io/projects/spring-boot) 3.2, Java 17
-   **Frontend:** [React](https://react.dev/)
-   **Database:** [PostgreSQL](https://www.postgresql.org/) 15
-   **Tools:** [Docker](https://www.docker.com/), [Git](https://git-scm.com/)

## 📋 Yêu cầu Cài đặt

-   [Docker Desktop](https://www.docker.com/products/docker-desktop/)
-   [JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
-   [Node.js](https://nodejs.org/en) (v18 trở lên)
-   [Git](https://git-scm.com/)

## ⚙️ Cài đặt và Chạy dự án

Thực hiện các bước sau theo thứ tự để khởi chạy toàn bộ hệ thống.

### 1. Clone Repository

```bash
git clone <repo-url>
cd elearning-platform
```

### 2. Khởi động Database

Dự án sử dụng Docker Compose để khởi tạo PostgreSQL.

```bash
# Khởi động container database
docker-compose up -d

# Kiểm tra để chắc chắn database đã chạy
docker-compose ps
```

### 3. Chạy Backend (Spring Boot)

```bash
# Di chuyển vào thư mục backend
cd BackEnd_elearning

# Chạy ứng dụng (dành cho Windows)
./mvnw.cmd spring-boot:run

# Chạy ứng dụng (dành cho macOS/Linux)
./mvnw spring-boot:run
```

> 🖥️ Backend sẽ khởi chạy tại `http://localhost:8080`.

### 4. Thiết lập Ngrok (Để nhận Callback từ VNPay)

Để VNPay có thể gửi kết quả thanh toán về máy local, chúng ta cần tạo một tunnel công khai.

```bash
# Chạy Ngrok trỏ đến cổng 8080 của backend
# Lưu ý: Thay <YOUR_NGROK_AUTHTOKEN> bằng token của bạn
docker run --rm -it -e NGROK_AUTHTOKEN=<YOUR_NGROK_AUTHTOKEN> ngrok/ngrok http host.docker.internal:8080
```
> 🔗 Sao chép lại URL `https://*.ngrok-free.app` mà Ngrok cung cấp để sử dụng cho bước thanh toán.

### 5. Chạy Frontend (React)

```bash
# Mở một terminal mới và di chuyển vào thư mục frontend
cd frontend

# Cài đặt các dependencies
npm install

# Khởi động server dev
npm run dev
```

> 🖥️ Frontend sẽ khởi chạy tại `http://localhost:5173` (hoặc một port khác được thông báo).

## 💳 Hướng dẫn Test Thanh toán VNPay

Sử dụng thông tin thẻ test dưới đây tại giao diện thanh toán của ứng dụng.

1.  **Chọn ngân hàng:**
    -   Click vào logo ngân hàng `NCB`.
2.  **Điền thông tin thẻ:**
    -   **Số thẻ:** `9704198526191432198`
    -   **Tên chủ thẻ:** `NGUYEN VAN A`
    -   **Ngày phát hành:** `07/15`
3.  **Xác thực OTP:**
    -   **Mã OTP:** `123456`

## 📈 Quản lý Giao dịch (VNPay Sandbox)

Bạn có thể đăng nhập vào trang quản trị của VNPay Sandbox để xem và quản lý các giao dịch test.

-   **Link:** [https://sandbox.vnpayment.vn/merchantv2/](https://sandbox.vnpayment.vn/merchantv2/Users/Login.htm?ReturnUrl=%2fmerchantv2%2fHome%2fDashboard.htm)
-   **Tài khoản:**
    ```
    dinhnhathoang2k4@gmail.com
    ```
-   **Mật khẩu:**
    ```
    Bong123123
    ```