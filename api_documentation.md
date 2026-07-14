# Creator Collaboration Hub - API Documentation

The Creator Collaboration Hub backend is a secure REST API engineered using Node.js, Express.js, and SQL. It manages collaboration pitches, handles JWT admin authentication, saves details dynamically, and fires automated email alerts.

---

## 1. Public Endpoints

### 1.1 Submit Collaboration Request
Receives brand pitches directly from the bio link.

* **URL:** `/api/collaborations`
* **Method:** `POST`
* **Content-Type:** `application/json`
* **Body:**
```json
{
  "name": "Tony Stark",
  "mobile": "+1 234 567 8900",
  "email": "tony@starkindustries.com",
  "instagram": "@tonystark",
  "company": "Stark Industries",
  "collaboration_type": "Brand Promotion",
  "video_idea": "Sleek tech unboxing with CGI iron man suit overlay.",
  "description": "We want to promote our new clean energy reactor concept.",
  "preferred_date": "2026-08-01",
  "preferred_time": "18:00",
  "budget": 5000,
  "deadline": "2026-07-31",
  "reference_link": "https://starkindustries.com/reactor",
  "image": "data:image/png;base64,...",
  "editing_required": true,
  "voiceover_required": false,
  "thumbnail_required": true,
  "script_required": true,
  "priority": "high"
}
```
* **Success Response (Code 210):**
```json
{
  "success": true,
  "message": "Collaboration request submitted successfully",
  "requestId": 12
}
```

### 1.2 Admin Sign In
Authenticates administrators and issues a secure JWT token.

* **URL:** `/api/auth/login`
* **Method:** `POST`
* **Content-Type:** `application/json`
* **Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```
* **Success Response (Code 200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "username": "admin"
  }
}
```

---

## 2. Protected Admin Endpoints
All endpoints below require a valid JSON Web Token sent inside the HTTP Header:
`Authorization: Bearer <your_jwt_token>`

### 2.1 Verify Authentication Token
Checks if the current browser JWT token is still valid.

* **URL:** `/api/auth/verify`
* **Method:** `GET`
* **Headers:** `Authorization: Bearer <token>`
* **Success Response (Code 200):**
```json
{
  "success": true,
  "admin": {
    "id": 1,
    "username": "admin"
  }
}
```

### 2.2 Retrieve Paginated & Filtered Requests
Lists submitted collaboration requests with support for dynamic searching, filtering, and database pagination.

* **URL:** `/api/admin/requests`
* **Method:** `GET`
* **Headers:** `Authorization: Bearer <token>`
* **Query Parameters (All Optional):**
  * `search`: String (matches Name, Email, Instagram, Video Idea, Company)
  * `status`: `pending` | `accepted` | `completed` | `rejected`
  * `priority`: `low` | `medium` | `high`
  * `page`: Integer (Default: `1`)
  * `limit`: Integer (Default: `10`)
* **Success Response (Code 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 12,
      "name": "Tony Stark",
      "email": "tony@starkindustries.com",
      "mobile": "+12345678900",
      "instagram": "@tonystark",
      "company": "Stark Industries",
      "collaboration_type": "Brand Promotion",
      "video_idea": "Sleek tech unboxing with CGI iron man suit overlay.",
      "description": "We want to promote our new clean energy reactor concept.",
      "preferred_date": "2026-08-01",
      "preferred_time": "18:00",
      "budget": 5000,
      "deadline": "2026-07-31",
      "reference_link": "https://starkindustries.com/reactor",
      "image": "data:image/png;base64,...",
      "editing_required": 1,
      "voiceover_required": 0,
      "thumbnail_required": 1,
      "script_required": 1,
      "priority": "high",
      "status": "pending",
      "notes": "Discussed details",
      "created_at": "2026-07-14 00:00:00"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### 2.3 Get Specific Request Details
Fetches full information for a single collaboration item.

* **URL:** `/api/admin/requests/:id`
* **Method:** `GET`
* **Headers:** `Authorization: Bearer <token>`
* **Success Response (Code 200):**
```json
{
  "success": true,
  "data": { ... }
}
```

### 2.4 Update Request Status
Transitions a brief's pipeline status.

* **URL:** `/api/admin/requests/:id/status`
* **Method:** `PUT`
* **Headers:** `Authorization: Bearer <token>`
* **Body:**
```json
{
  "status": "accepted" // 'pending' | 'accepted' | 'completed' | 'rejected'
}
```
* **Success Response (Code 200):**
```json
{
  "success": true,
  "message": "Request status updated to accepted successfully"
}
```

### 2.5 Update Internal Notes
Adds or modifies internal creator workspace annotations.

* **URL:** `/api/admin/requests/:id/notes`
* **Method:** `PUT`
* **Headers:** `Authorization: Bearer <token>`
* **Body:**
```json
{
  "notes": "Contract sent. Scheduled voice recording session for Thursday morning."
}
```
* **Success Response (Code 200):**
```json
{
  "success": true,
  "message": "Notes updated successfully"
}
```

### 2.6 Delete Request Permanent
Deletes a request completely from the database.

* **URL:** `/api/admin/requests/:id`
* **Method:** `DELETE`
* **Headers:** `Authorization: Bearer <token>`
* **Success Response (Code 200):**
```json
{
  "success": true,
  "message": "Collaboration request deleted successfully"
}
```

### 2.7 Fetch Dashboard Cards Statistics
Compiles group sums for status cards metrics.

* **URL:** `/api/admin/stats`
* **Method:** `GET`
* **Headers:** `Authorization: Bearer <token>`
* **Success Response (Code 200):**
```json
{
  "success": true,
  "data": {
    "total": 12,
    "pending": 5,
    "accepted": 3,
    "completed": 3,
    "rejected": 1
  }
}
```
