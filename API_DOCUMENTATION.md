# API Documentation: AI-Based Universal Fruit and Vegetable Quality Grading System

This document outlines the REST API endpoints provided by the application backend for web, mobile, and external integrations.

---

## 1. Authentication Endpoints

### Register User
- **Endpoint**: `POST /api/auth/register`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "username": "Inspector_Green",
    "email": "inspector@farm.org",
    "password": "SecurePassword123",
    "accountType": "Organisation", // "Organisation" or "Individual Person"
    "organizationName": "Green Valley Orchards Ltd",
    "contactNumber": "+1 (555) 234-5678"
  }
  ```
- **Response** `(201 Created)`:
  ```json
  {
    "token": "user_id_string",
    "user": {
      "id": "user_id_string",
      "username": "Inspector_Green",
      "email": "inspector@farm.org",
      "accountType": "Organisation",
      "organizationName": "Green Valley Orchards Ltd"
    },
    "message": "Registration successful."
  }
  ```

### Login User
- **Endpoint**: `POST /api/auth/login`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "inspector@farm.org",
    "password": "SecurePassword123",
    "accountType": "Organisation"
  }
  ```
- **Response** `(200 OK)`:
  ```json
  {
    "token": "user_id_string",
    "user": { ... },
    "message": "Login successful."
  }
  ```

### Profile Details & Update
- **Endpoint**: `GET /api/auth/profile` / `PUT /api/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **PUT Body**: `{ "username": "New Name", "organizationName": "New Org", "contactNumber": "..." }`

---

## 2. Settings Endpoints

### Retrieve Settings
- **Endpoint**: `GET /api/settings`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "settings": {
      "theme": "system", // "light", "dark", or "system"
      "speed": "balanced", // "fast", "balanced", or "detailed"
      "model": "premium"  // "premium" or "general"
    }
  }
  ```

### Update Settings
- **Endpoint**: `PUT /api/settings`
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body**: `{ "theme": "dark", "speed": "detailed", "model": "premium" }`

---

## 3. Grading Pipeline Endpoints

### Run AI Grading Scan
- **Endpoint**: `POST /api/grading/scan`
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "mediaUrl": "data:image/jpeg;base64,...",
    "mediaType": "image", // or "video"
    "produceHint": "Apple" // optional
  }
  ```
- **Response** `(200 OK)`:
  ```json
  {
    "success": true,
    "result": {
      "id": "GR-2026-0891",
      "produceName": "Apple",
      "cropCategory": "Fruit",
      "detectedItemCount": 1,
      "finalGrade": "Grade A",
      "qualityClass": "Premium Class 1",
      "confidences": {
        "produceId": 0.98,
        "defectDetection": 0.94,
        "qualityClassification": 0.96,
        "overall": 0.96
      },
      "defects": [
        {
          "id": "DEF-01",
          "type": "Superficial Scab",
          "severity": "Minor",
          "affectedAreaPercent": 0.8,
          "confidence": 0.94,
          "boundingBox": { "x": 38, "y": 44, "width": 10, "height": 9 },
          "description": "Minor superficial lenticel specks."
        }
      ],
      "overallDefectAreaPercent": 0.8,
      "reasons": [
        "Superficial defect area (0.8%) is within strict Grade A threshold (<= 2.5%).",
        "Uniform skin pigmentation, firm perimeter geometry, and zero fungal lesions."
      ],
      "gradingRulesApplied": "International USDA/OECD commercial standards for dessert and processing apples.",
      "humanReviewRequired": false,
      "processingDate": "2026-10-16T12:00:00Z",
      "status": "Completed"
    }
  }
  ```

---

## 4. History Endpoints

### List Historical Grading Records
- **Endpoint**: `GET /api/grading/history?search={query}&grade={Grade A|Grade B|Grade C|Rejected}`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ "history": [ ... ] }`

### Get Specific Grading Record
- **Endpoint**: `GET /api/grading/result/:id`
- **Headers**: `Authorization: Bearer <token>`

---

## 5. Support Desk Endpoints

### Submit Technical Inquiry
- **Endpoint**: `POST /api/support/submit`
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "subject": "Threshold Calibration Question",
    "message": "Inquiry regarding allowable surface russeting percentages on Gala apples."
  }
  ```
- **Response**: `{ "success": true, "ticket": { ... } }`
