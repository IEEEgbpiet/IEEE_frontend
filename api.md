# IEEE Backend API Reference Documentation

Comprehensive API documentation for the IEEE GBPIET Student Branch Backend.

## 📊 Summary of APIs
- **Total APIs Count:** 30
- **Total Modules:** 7
- **Base URL:** `https://ieee-backend-7z25.onrender.com`

---

## 🔐 Authentication & OTP Module (`/api/v1/auth`)

### 1. Admin Login
- **Endpoint:** `POST /api/v1/auth/login`
- **Auth Required:** No (Rate limited: max 10 attempts per 15 minutes)
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "ieee@gbpiet.ac.in",
    "password": "AdminPassword123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "msg": "Login Successfull",
    "success": true,
    "user": {
      "id": "6741ab82cd98ef1234567890",
      "email": "ieee@gbpiet.ac.in"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Response (401 Unauthorized):**
  ```json
  {
    "success": false,
    "message": "Incorrect password"
  }
  ```

---

### 2. Admin Logout
- **Endpoint:** `POST /api/v1/auth/logout`
- **Auth Required:** No
- **Headers:** None
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Logout successful"
  }
  ```

---

### 3. Generate Password Reset OTP
- **Endpoint:** `POST /api/v1/auth/resetPassword/otp/generateOTP`
- **Description:** Sends a cryptographically generated 6-digit OTP to the administrator email address.
- **Auth Required:** No
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "ieee@gbpiet.ac.in"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Password reset OTP sent successfully"
  }
  ```
- **Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Unauthorized email address"
  }
  ```

---

### 4. Verify Password Reset OTP
- **Endpoint:** `POST /api/v1/auth/resetPassword/otp/verifyOtp`
- **Description:** Validates the 6-digit OTP and generates a temporary `resetToken` (valid for 10 minutes).
- **Auth Required:** No
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "ieee@gbpiet.ac.in",
    "otp": "482910"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "OTP verified successfully",
    "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Invalid OTP. 2 attempt(s) remaining."
  }
  ```

---

### 5. Reset Admin Password
- **Endpoint:** `PATCH /api/v1/auth/resetPassword`
- **Description:** Resets the administrator password using the verified `resetToken`.
- **Auth Required:** No (resetToken provided in body or Authorization header)
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "newPassword": "NewStrongPassword@2026",
    "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Password reset successfully"
  }
  ```
- **Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Invalid or expired reset token"
  }
  ```
