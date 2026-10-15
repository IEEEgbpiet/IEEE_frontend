# IEEE Backend API Reference Documentation

Comprehensive API documentation for the IEEE GBPIET Student Branch Backend.

## 📊 Summary of APIs
- **Total APIs Count:** 38
- **Total Modules:** 10
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

---

## 8. Registration Module (`/api/v1/registration`)

Manages participant event registrations (supporting both `INDIVIDUAL` and `TEAM` formats) and automatically initializes pending certificate entries for all registered members.

### 1. Create New Registration
- **Endpoint:** `POST /api/v1/registration/new`
- **Description:** Registers an individual participant or a multi-member team for an IEEE event. Upon successful validation, generates a unique 7-digit `registrationId` and automatically provisions pending certificates with unique certificate IDs in the `certificate` collection for all member participants.
- **Auth Required:** No (Public)
- **Headers:** `Content-Type: application/json`
- **Query Parameters:**
  - `mode` *(string, required)*: Registration format. Allowed values: `INDIVIDUAL` or `TEAM` (case-insensitive).
    - Example: `POST /api/v1/registration/new?mode=INDIVIDUAL`
    - Example: `POST /api/v1/registration/new?mode=TEAM`

#### Individual Registration Request Example
- **Endpoint:** `POST /api/v1/registration/new?mode=INDIVIDUAL`
- **Request Body:**
  ```json
  {
    "eventName": "IEEE Web Development Bootcamp 2026",
    "date": "2026-04-15",
    "members": [
      {
        "instituteId": "22010101",
        "name": "Aarav Sharma",
        "phone": "9876543210",
        "email": "aarav.sharma@example.com",
        "year": 3,
        "branch": "CSE"
      }
    ]
  }
  ```
- **Response (201 Created - Individual):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "6741b0a1e4b01234567890ab",
      "registrationId": "4819203",
      "date": "2026-04-15",
      "eventName": "IEEE Web Development Bootcamp 2026",
      "mode": "INDIVIDUAL",
      "teamName": null,
      "members": [
        {
          "instituteId": "22010101",
          "name": "Aarav Sharma",
          "phone": "9876543210",
          "email": "aarav.sharma@example.com",
          "year": 3,
          "branch": "CSE"
        }
      ],
      "createdAt": "2026-10-06T16:00:00.000Z",
      "updatedAt": "2026-10-06T16:00:00.000Z"
    }
  }
  ```

#### Team Registration Request Example
- **Endpoint:** `POST /api/v1/registration/new?mode=TEAM`
- **Request Body:**
  ```json
  {
    "eventName": "IEEE Day Hackathon 2026",
    "date": "2026-04-20",
    "teamName": "CyberKnights",
    "members": [
      {
        "instituteId": "22010101",
        "name": "Aarav Sharma",
        "phone": "9876543210",
        "email": "aarav.sharma@example.com",
        "year": 3,
        "branch": "CSE"
      },
      {
        "instituteId": "22010145",
        "name": "Priya Verma",
        "phone": "9876543211",
        "email": "priya.verma@example.com",
        "year": 3,
        "branch": "AIML"
      }
    ]
  }
  ```
- **Response (201 Created - Team):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "6741b0a1e4b01234567890ac",
      "registrationId": "7392814",
      "date": "2026-04-20",
      "eventName": "IEEE Day Hackathon 2026",
      "mode": "TEAM",
      "teamName": "CyberKnights",
      "members": [
        {
          "instituteId": "22010101",
          "name": "Aarav Sharma",
          "phone": "9876543210",
          "email": "aarav.sharma@example.com",
          "year": 3,
          "branch": "CSE"
        },
        {
          "instituteId": "22010145",
          "name": "Priya Verma",
          "phone": "9876543211",
          "email": "priya.verma@example.com",
          "year": 3,
          "branch": "AIML"
        }
      ],
      "createdAt": "2026-10-06T16:05:00.000Z",
      "updatedAt": "2026-10-06T16:05:00.000Z"
    }
  }
  ```

---

### 2. Get Registration By ID
- **Endpoint:** `GET /api/v1/registration/getInfo/:registrationId`
- **Description:** Retrieves registration details for a specific individual or team using their unique 7-digit `registrationId`.
- **Auth Required:** No (Public)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "6741b0a1e4b01234567890ab",
      "registrationId": "4819203",
      "date": "2026-04-15",
      "eventName": "IEEE Web Development Bootcamp 2026",
      "mode": "INDIVIDUAL",
      "teamName": null,
      "members": [
        {
          "instituteId": "22010101",
          "name": "Aarav Sharma",
          "phone": "9876543210",
          "email": "aarav.sharma@example.com",
          "year": 3,
          "branch": "CSE"
        }
      ],
      "createdAt": "2026-10-06T16:00:00.000Z",
      "updatedAt": "2026-10-06T16:00:00.000Z"
    }
  }
  ```

---

### 3. Get All Registrations
- **Endpoint:** `GET /api/v1/registration/getAll`
- **Description:** Retrieves a complete list of all event registrations, sorted in descending order of registration date (`createdAt: -1`).
- **Auth Required:** No (Public)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "6741b0a1e4b01234567890ac",
        "registrationId": "7392814",
        "date": "2026-04-20",
        "eventName": "IEEE Day Hackathon 2026",
        "mode": "TEAM",
        "teamName": "CyberKnights",
        "members": [
          {
            "instituteId": "22010101",
            "name": "Aarav Sharma",
            "phone": "9876543210",
            "email": "aarav.sharma@example.com",
            "year": 3,
            "branch": "CSE"
          },
          {
            "instituteId": "22010145",
            "name": "Priya Verma",
            "phone": "9876543211",
            "email": "priya.verma@example.com",
            "year": 3,
            "branch": "AIML"
          }
        ],
        "createdAt": "2026-10-06T16:05:00.000Z",
        "updatedAt": "2026-10-06T16:05:00.000Z"
      }
    ]
  }
  ```

---

## 9. Student Directory Module (`/api/v1/directory`)

Manages student directory records and profiles within the institution.

### 1. Get All Student Profiles
- **Endpoint:** `GET /api/v1/directory/getAll`
- **Description:** Retrieves a complete list of all student directory profiles, sorted in ascending alphabetical order by student name (`name: 1`).
- **Auth Required:** No (Public)
- **Headers:** None
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "_id": "6741b123e4b01234567890e1",
        "instituteId": "22010101",
        "name": "Aarav Sharma",
        "branch": "CSE",
        "year": 3,
        "batchYear": 2026,
        "email": "aarav.sharma@example.com",
        "phone": "9876543210",
        "gender": "MALE",
        "createdAt": "2026-10-06T10:00:00.000Z",
        "updatedAt": "2026-10-06T10:00:00.000Z"
      }
    ]
  }
  ```

---

## 10. Announcement Module (`/api/v1/announcement`)

Manages general-purpose announcements and popups for the IEEE student branch. Supports flexible content — frontend can send any combination of `title`, `description`, and `image`, but must provide **at least one** field.

### 1. Get All Announcements
- **Endpoint:** `GET /api/v1/announcement/getAll`
- **Description:** Retrieves all announcements sorted in reverse chronological order (`createdAt: -1`). Used across public modals, popups, and admin directory.
- **Auth Required:** No (Public)
- **Headers:** None
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "_id": "6ace11851cff29b2e59f9024",
        "AnnouncementId": "ANN8088195239",
        "title": "Workshop 2026",
        "description": "Annual IEEE workshop coming soon!",
        "image": {
          "url": "https://res.cloudinary.com/ieee-gbpiet/image/upload/v1727280000/ieee-announcements/banner1.png",
          "publicId": "ieee-announcements/banner1"
        },
        "createdAt": "2026-10-13T11:09:57.503Z",
        "updatedAt": "2026-10-13T11:09:57.503Z"
      },
      {
        "_id": "6ace117c1cff29b2e59f9023",
        "AnnouncementId": "ANN6387949797",
        "title": "Special Announcement",
        "description": "Important notice regarding upcoming student branch activities.",
        "image": {
          "url": "",
          "publicId": ""
        },
        "createdAt": "2026-10-13T11:09:48.990Z",
        "updatedAt": "2026-10-13T11:09:48.990Z"
      }
    ]
  }
  ```

---

### 2. Create New Announcement
- **Endpoint:** `POST /api/v1/announcement/Createnew`
- **Description:** Creates a new announcement with optional Cloudinary image upload. At least one of `title`, `description`, or `image` must be provided.
- **Auth Required:** Yes (`verifyToken`)
- **Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **FormData Fields:**
  - `title` *(string, optional)*: Announcement headline
  - `description` *(string, optional)*: Announcement body/description
  - `image` *(file, optional)*: Image file (`jpg`, `jpeg`, `png`, `webp`, max 5MB)
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Announcement created successfully",
    "data": {
      "_id": "6ace117c1cff29b2e59f9023",
      "AnnouncementId": "ANN6387949797",
      "title": "Workshop 2026",
      "description": "Annual IEEE workshop coming soon!",
      "image": {
        "url": "https://res.cloudinary.com/ieee-gbpiet/image/upload/v1727280000/ieee-announcements/banner1.png",
        "publicId": "ieee-announcements/banner1"
      },
      "createdAt": "2026-10-13T11:09:48.990Z",
      "updatedAt": "2026-10-13T11:09:48.990Z"
    }
  }
  ```

---

### 3. Update Announcement
- **Endpoint:** `PATCH /api/v1/announcement/edit/:id`
- **Description:** Updates an existing announcement by `AnnouncementId` or MongoDB `_id`. Supports partial updates. If a new image is uploaded, the previous Cloudinary asset is automatically destroyed.
- **Auth Required:** Yes (`verifyToken`)
- **Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data` or `application/json`
- **URL Parameters:** `:id` (`AnnouncementId` or MongoDB `_id`)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Announcement updated successfully",
    "data": {
      "_id": "6ace117c1cff29b2e59f9023",
      "AnnouncementId": "ANN6387949797",
      "title": "Updated Announcement Title",
      "description": "Updated announcement body",
      "image": {
        "url": "https://res.cloudinary.com/ieee-gbpiet/image/upload/v1727280000/ieee-announcements/banner1.png",
        "publicId": "ieee-announcements/banner1"
      },
      "createdAt": "2026-10-13T11:09:48.990Z",
      "updatedAt": "2026-10-13T11:10:30.933Z"
    }
  }
  ```

---

### 4. Delete Announcement
- **Endpoint:** `DELETE /api/v1/announcement/delete/:id`
- **Description:** Deletes an announcement by `AnnouncementId` or MongoDB `_id` and deletes any associated Cloudinary image.
- **Auth Required:** Yes (`verifyToken`)
- **Headers:** `Authorization: Bearer <token>`
- **URL Parameters:** `:id` (`AnnouncementId` or MongoDB `_id`)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Announcement deleted successfully",
    "data": {
      "_id": "6ace117c1cff29b2e59f9023",
      "AnnouncementId": "ANN6387949797"
    }
  }
  ```
