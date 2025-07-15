# API Documentation

## Overview

The To-Do API is built with Django REST Framework and provides comprehensive endpoints for task management and user authentication using JWT tokens.

**Base URL:** `http://localhost:8000/api/`  
**Authentication:** JWT Bearer Token  
**Documentation:** 
- Swagger UI: `http://localhost:8000/swagger/`
- ReDoc: `http://localhost:8000/redoc/`

## Authentication

### Registration
```http
POST /api/users/
Content-Type: application/json

{
  "username": "string",
  "email": "user@example.com",
  "password": "string",
  "password2": "string"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "username": "testuser",
  "email": "user@example.com"
}
```

### Login
```http
POST /api/auth/login/
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Token Refresh
```http
POST /api/auth/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

## Tasks

All task endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

### List Tasks
```http
GET /api/tasks/
```

**Query Parameters:**
- `status` - Filter by status (`pending`, `in_progress`, `completed`)
- `priority` - Filter by priority (`low`, `medium`, `high`)
- `due_date` - Filter by due date (`today`, `upcoming`, `overdue`)
- `search` - Search in title and description
- `ordering` - Sort by field (`created_at`, `-created_at`, `due_date`, `-due_date`, `order`)

**Examples:**
```http
GET /api/tasks/?status=pending&priority=high
GET /api/tasks/?search=meeting&ordering=-created_at
GET /api/tasks/?due_date=today
```

**Response (200 OK):**
```json
{
  "count": 25,
  "next": "http://localhost:8000/api/tasks/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "status": "in_progress",
      "priority": "high",
      "due_date": "2025-07-20",
      "created_at": "2025-07-15T10:30:00Z",
      "updated_at": "2025-07-15T12:00:00Z",
      "order": 1,
      "user": 1
    }
  ]
}
```

### Create Task
```http
POST /api/tasks/
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "priority": "low|medium|high",
  "status": "pending|in_progress|completed",
  "due_date": "2025-07-20"
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "title": "New task",
  "description": "Task description",
  "status": "pending",
  "priority": "medium",
  "due_date": "2025-07-20",
  "created_at": "2025-07-15T14:30:00Z",
  "updated_at": "2025-07-15T14:30:00Z",
  "order": 2,
  "user": 1
}
```

### Get Single Task
```http
GET /api/tasks/{id}/
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "in_progress",
  "priority": "high",
  "due_date": "2025-07-20",
  "created_at": "2025-07-15T10:30:00Z",
  "updated_at": "2025-07-15T12:00:00Z",
  "order": 1,
  "user": 1
}
```

### Update Task
```http
PUT /api/tasks/{id}/
Content-Type: application/json

{
  "title": "Updated task title",
  "description": "Updated description",
  "priority": "high",
  "status": "completed",
  "due_date": "2025-07-25"
}
```

### Partial Update Task
```http
PATCH /api/tasks/{id}/
Content-Type: application/json

{
  "status": "completed"
}
```

### Delete Task
```http
DELETE /api/tasks/{id}/
```

**Response (204 No Content)**

### Reorder Tasks (Drag & Drop)
```http
PATCH /api/tasks/reorder/
Content-Type: application/json

{
  "task_orders": [
    {"id": 1, "order": 3},
    {"id": 2, "order": 1},
    {"id": 3, "order": 2}
  ]
}
```

**Response (200 OK):**
```json
{
  "message": "Tasks reordered successfully"
}
```

### Task Statistics
```http
GET /api/tasks/stats/
```

**Response (200 OK):**
```json
{
  "total_tasks": 25,
  "completed_tasks": 15,
  "pending_tasks": 8,
  "in_progress_tasks": 2,
  "overdue_tasks": 3,
  "completion_rate": 60.0,
  "tasks_by_priority": {
    "high": 5,
    "medium": 12,
    "low": 8
  },
  "tasks_by_status": {
    "pending": 8,
    "in_progress": 2,
    "completed": 15
  }
}
```

## Error Handling

The API uses conventional HTTP response codes to indicate success or failure.

### HTTP Status Codes

- `200` - OK: The request was successful
- `201` - Created: The resource was successfully created
- `204` - No Content: The request was successful (for DELETE operations)
- `400` - Bad Request: The request was invalid or cannot be served
- `401` - Unauthorized: Authentication is required
- `403` - Forbidden: Access is forbidden to the requested resource
- `404` - Not Found: The requested resource could not be found
- `500` - Internal Server Error: An error occurred on the server

### Error Response Format

```json
{
  "detail": "Error message describing what went wrong"
}
```

**Validation Errors (400 Bad Request):**
```json
{
  "field_name": [
    "This field is required."
  ],
  "another_field": [
    "Ensure this field has no more than 255 characters."
  ]
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Anonymous users:** 100 requests per hour
- **Authenticated users:** 1000 requests per hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1626789600
```

## Pagination

List endpoints use pagination with the following parameters:

**Query Parameters:**
- `page` - Page number (default: 1)
- `page_size` - Number of items per page (default: 20, max: 100)

**Response Format:**
```json
{
  "count": 150,
  "next": "http://localhost:8000/api/tasks/?page=3",
  "previous": "http://localhost:8000/api/tasks/?page=1",
  "results": [...]
}
```

## Filtering and Search

### Available Filters

**Tasks:**
- `status`: `pending`, `in_progress`, `completed`
- `priority`: `low`, `medium`, `high`
- `due_date`: `today`, `upcoming`, `overdue`
- `search`: Search in title and description (case-insensitive)

### Date Filters

- `today`: Tasks due today
- `upcoming`: Tasks due in the next 7 days
- `overdue`: Tasks past their due date

### Examples

```http
# Get high priority pending tasks
GET /api/tasks/?status=pending&priority=high

# Search for tasks containing "meeting"
GET /api/tasks/?search=meeting

# Get overdue tasks
GET /api/tasks/?due_date=overdue

# Complex filtering
GET /api/tasks/?status=pending&priority=high&search=project&ordering=-created_at
```

## WebSocket Support (Future Enhancement)

The API is designed to support real-time updates via WebSockets for:
- Live task updates
- Real-time collaboration
- Instant notifications

## SDK and Client Libraries

Official client libraries are planned for:
- JavaScript/TypeScript
- Python
- Mobile (React Native)

## Changelog

### v1.0.0 (Current)
- Initial API release
- JWT authentication
- Full CRUD operations for tasks
- Advanced filtering and search
- Task statistics
- Drag & drop reordering

---

For questions or support, please refer to the main README.md or open an issue on GitHub.
