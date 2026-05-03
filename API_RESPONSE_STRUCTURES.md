# StudyForge API Response Structures

## 🎯 Habits

### Habit Object
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "streak": "number",
  "completed_today": "boolean",
  "created_at": "ISO 8601 timestamp"
}
```

### GET /api/habits
**Response:** `Array<Habit>`

```json
[
  {
    "completed_today": true,
    "created_at": "2026-05-03T16:17:15.111608",
    "description": "dgfn",
    "id": "66d8a33b-b077-4194-a888-8b4cce162df8",
    "name": "sd",
    "streak": 2
  }
]
```

### POST /api/habits
**Request Body:**
```json
{
  "name": "string (required, min 3 chars)",
  "description": "string (optional)"
}
```

**Response:** `Habit` (201)

### PUT /api/habits/{id}
**Response:** `Habit` (200) — streak incremented, completed_today set to true

### DELETE /api/habits/{id}
**Response:** `{ "message": "string" }` (200)

---

## 📝 Notes

### Note Object
```json
{
  "id": "uuid",
  "title": "string",
  "content": "string",
  "tag": "string",
  "created_at": "ISO 8601 timestamp"
}
```

### GET /api/notes
**Response:** `Array<Note>` (ordered by created_at DESC)

### POST /api/notes
**Request Body:**
```json
{
  "title": "string (required)",
  "content": "string (required)",
  "tag": "string (optional)"
}
```

**Response:** `Note` (201)

### PUT /api/notes/{id}
**Request Body:**
```json
{
  "title": "string (optional)",
  "content": "string (optional)",
  "tag": "string (optional)"
}
```

**Response:** `Note` (200)

### DELETE /api/notes/{id}
**Response:** `{ "message": "string" }` (200)

---

## 📚 Courses

### Course Object
```json
{
  "id": "uuid",
  "topic": "string",
  "content": "object (course outline)",
  "created_at": "ISO 8601 timestamp"
}
```

### GET /api/courses
**Response:** `Array<Course>` (ordered by created_at DESC)

### POST /api/courses
**Request Body:**
```json
{
  "topic": "string (required)",
  "content": "object (required)"
}
```

**Response:** `Course` (201)

### DELETE /api/courses/{id}
**Response:** `{ "message": "string" }` (200)

---

## ✨ Generate

### Generated Course Structure
```json
{
  "title": "string",
  "description": "string",
  "modules": [
    {
      "module_number": "number",
      "title": "string",
      "description": "string",
      "subtopics": ["string", "string", "string"]
    }
  ]
}
```

### POST /api/generate
**Request Body:**
```json
{
  "topic": "string (required)"
}
```

**Response:** `GeneratedCourse` (200)

---

## 🔴 Error Response (All Endpoints)

### Standard Error
```json
{
  "error": "string",
  "details": "string (optional)"
}
```

**Status Codes:**
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Server Error
