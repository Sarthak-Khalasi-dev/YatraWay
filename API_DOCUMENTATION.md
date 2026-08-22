# WanderLust API Documentation

Welcome to the WanderLust API documentation. This document provides a comprehensive overview of the available endpoints, their expected request bodies, and their response formats.

## Base URL
The API is hosted at: `http://localhost:5000/api`

## Interactive Documentation
You can access the interactive Swagger documentation at:
`http://localhost:5000/api-docs`

---

## Authentication (`/auth`)

### 1. Register User
*   **Endpoint:** `POST /register`
*   **Description:** Creates a new user account.
*   **Request Body:**
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123"
    }
    ```
*   **Response (201):**
    ```json
    {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "...",
      "token": "JWT_TOKEN"
    }
    ```

### 2. Login User
*   **Endpoint:** `POST /login`
*   **Description:** Authenticates a user and returns a token.
*   **Request Body:**
    ```json
    {
      "email": "john@example.com",
      "password": "password123"
    }
    ```
*   **Response (200):** Same as Register.

---

## Trip Management (`/trips`)
*All routes require Bearer Token in Authorization header.*

### 1. Get All Trips
*   **Endpoint:** `GET /`
*   **Response (200):** Array of Trip objects.

### 2. Create Trip
*   **Endpoint:** `POST /`
*   **Request Body:**
    ```json
    {
      "dest": "Paris, France",
      "dates": "May 10 - May 15",
      "status": "Planned",
      "budget": 2000,
      "spent": 0,
      "members": 2,
      "progress": 20,
      "notes": "Eiffel Tower visit",
      "activities": []
    }
    ```

---

## Emergency Services (`/emergency`)
*All routes require Bearer Token in Authorization header.*

### 1. Get Emergency Contacts
*   **Endpoint:** `GET /`
*   **Response (200):** Array of Emergency Contact objects.

---

## File Uploads (`/upload`)
*Requires Bearer Token in Authorization header.*

### 1. Upload Image
*   **Endpoint:** `POST /`
*   **Content-Type:** `multipart/form-data`
*   **Field:** `image` (File)
*   **Response (200):**
    ```json
    {
      "message": "Image uploaded",
      "image": "http://localhost:5000/uploads/..."
    }
    ```
