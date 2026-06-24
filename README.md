# Task Management API

A RESTful Task Management API built with **FastAPI**, **SQLAlchemy**, and **PostgreSQL** (Supabase). Supports user authentication via JWT, full CRUD operations for tasks and users, task assignment, and a dashboard summary.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [Database Migrations](#database-migrations)
- [API Documentation](#api-documentation)

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **FastAPI** | Web framework |
| **SQLAlchemy** | ORM & database models |
| **PostgreSQL (Supabase)** | Database |
| **Alembic** | Database migrations |
| **python-jose** | JWT token encoding/decoding |
| **Passlib (pbkdf2_sha256)** | Password hashing |
| **Pydantic** | Request/response validation |
| **Uvicorn** | ASGI server |
| **uv** | Python package manager |

---

## Project Structure

```
Task_management/
├── app/
│   ├── main.py                  # FastAPI app entry point
│   ├── core/
│   │   ├── config.py            # App configuration
│   │   └── security.py          # Security utilities
│   ├── database/
│   │   └── database.py          # DB engine, session, Base
│   ├── dependencies/
│   │   └── auth.py              # get_current_user dependency
│   ├── models/
│   │   ├── user.py              # User SQLAlchemy model
│   │   └── task.py              # Task SQLAlchemy model
│   ├── routers/
│   │   ├── auth.py              # /auth endpoints
│   │   ├── tasks.py             # /tasks endpoints
│   │   ├── users.py             # /users endpoints
│   │   └── dashboard.py         # /dashboard endpoints
│   ├── schemas/
│   │   ├── auth.py              # Auth Pydantic schemas
│   │   ├── user.py              # User Pydantic schemas
│   │   └── task.py              # Task Pydantic schemas
│   ├── services/
│   │   ├── auth_service.py      # Auth business logic
│   │   ├── task_service.py      # Task business logic
│   │   └── user_service.py      # User business logic
│   └── utils/
│       ├── auth.py              # Password hashing & JWT
│       └── helpers.py           # Misc helpers
├── alembic/                     # Alembic migration files
├── alembic.ini                  # Alembic configuration
├── .env                         # Environment variables
├── .gitignore
├── pyproject.toml               # Project dependencies
└── uv.lock                     # Lock file
```

---

## Setup & Installation

### Prerequisites

- **Python 3.13+**
- **uv** (Python package manager) — [install guide](https://docs.astral.sh/uv/getting-started/installation/)
- **PostgreSQL** database (or a Supabase project)

### 1. Clone the Repository

```bash
git clone https://github.com/kathirkamadurai29/Task_management.git
cd Task_management
```

### 2. Install Dependencies

```bash
uv sync
```

This installs all dependencies from `pyproject.toml` and creates a `.venv` virtual environment automatically.

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL = postgresql://postgres:YOUR_PASSWORD@your-db-host:5432/postgres
JWT_SECRET_KEY = your-secret-key-here
```

> **⚠️ Important:** Never commit real credentials. Use a strong, unique `JWT_SECRET_KEY` in production.

### 4. Run Database Migrations

```bash
uv run alembic upgrade head
```

Or let the app auto-create tables on startup (the app calls `Base.metadata.create_all()` in `main.py`).

---

## Running the Server

### Development (with hot reload)

```bash
uv run uvicorn app.main:app --reload
```

The API will be available at **http://127.0.0.1:8000**

### Production

```bash
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Interactive Docs

Once running, open:

| Docs | URL |
|---|---|
| **Swagger UI** | http://127.0.0.1:8000/docs |
| **ReDoc** | http://127.0.0.1:8000/redoc |

---

## Database Migrations

This project uses **Alembic** for database migrations.

```bash
# Create a new migration
uv run alembic revision --autogenerate -m "description of change"

# Apply migrations
uv run alembic upgrade head

# Rollback one migration
uv run alembic downgrade -1
```

---

## API Documentation

### Base URL

```
http://127.0.0.1:8000
```

### Authentication

All protected endpoints require a **Bearer token** in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

Obtain a token via `POST /auth/login`.

---

### 🔐 Authentication Endpoints (`/auth`)

#### `GET /auth/test`

Health check for the auth router.

**Response:**
```json
{ "message": "Auth router working" }
```

---

#### `POST /auth/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "kathir",
  "email": "kathir@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**
```json
{ "message": "User registered successfully" }
```

**Error Response (400):**
```json
{ "detail": "Email already Exists" }
```

---

#### `POST /auth/login`

Login and receive a JWT access token. Uses OAuth2 form data.

**Request Body** (`application/x-www-form-urlencoded`):

| Field | Type | Description |
|---|---|---|
| `username` | string | Email or username |
| `password` | string | Account password |

**Success Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "token_type": "bearer"
}
```

**Error Response (401):**
```json
{ "detail": "Invalid email or password" }
```

---

#### `GET /auth/me` 🔒

Get the currently authenticated user's info.

**Response (200):**
```json
{
  "id": 1,
  "email": "kathir@example.com",
  "username": "kathir"
}
```

---

### 👤 User Endpoints (`/users`) 🔒

> All endpoints require authentication.

#### `GET /users/me`

Get current authenticated user profile.

**Response (200):**
```json
{
  "id": 1,
  "username": "kathir",
  "email": "kathir@example.com",
  "created_at": "2026-06-24T18:30:00"
}
```

---

#### `GET /users/`

List all registered users.

**Response (200):**
```json
[
  {
    "id": 1,
    "username": "kathir",
    "email": "kathir@example.com",
    "created_at": "2026-06-24T18:30:00"
  },
  {
    "id": 2,
    "username": "john",
    "email": "john@example.com",
    "created_at": "2026-06-24T19:00:00"
  }
]
```

---

#### `GET /users/{user_id}`

Get a specific user by ID.

| Parameter | Type | Description |
|---|---|---|
| `user_id` | int | User ID (path) |

**Response (200):**
```json
{
  "id": 1,
  "username": "kathir",
  "email": "kathir@example.com",
  "created_at": "2026-06-24T18:30:00"
}
```

**Error (404):**
```json
{ "detail": "User not found" }
```

---

#### `PUT /users/{user_id}`

Update your own user profile. Only the account owner can update.

**Request Body:**
```json
{
  "username": "kathir_updated",
  "email": "newemail@example.com"
}
```

> All fields are optional. Only provided fields are updated.

**Response (200):**
```json
{ "message": "User updated successfully" }
```

**Errors:**
| Status | Detail |
|---|---|
| 400 | Email already exists |
| 403 | Not authorized to update this user |
| 404 | User not found |

---

#### `DELETE /users/{user_id}`

Delete your own account. Only the account owner can delete.

**Response (200):**
```json
{ "message": "User deleted successfully" }
```

**Errors:**
| Status | Detail |
|---|---|
| 403 | Not authorized to delete this user |
| 404 | User not found |

---

### ✅ Task Endpoints (`/tasks`) 🔒

> All endpoints require authentication.

#### `POST /tasks/`

Create a new task. Optionally assign it to a user.

**Request Body:**
```json
{
  "title": "Build REST API",
  "description": "Create CRUD endpoints for task management",
  "assigned_to": 2
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | ✅ | Task title |
| `description` | string | ❌ | Task description |
| `assigned_to` | int | ❌ | User ID to assign the task to |

**Response (200):**
```json
{
  "message": "Task created Succesfully",
  "task_id": 1
}
```

**Error (404):**
```json
{ "detail": "Assigned user not found" }
```

---

#### `GET /tasks/`

Get all tasks created by the current user. Includes creator and assignee usernames.

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Build REST API",
    "description": "Create CRUD endpoints",
    "status": "pending",
    "creator_id": 1,
    "creator_username": "kathir",
    "assigned_to": 2,
    "assigned_to_username": "john",
    "created_at": "2026-06-24T18:30:00",
    "updated_at": "2026-06-24T18:30:00"
  }
]
```

---

#### `GET /tasks/{task_id}`

Get a specific task by ID. Only the creator can view.

**Response (200):**
```json
{
  "id": 1,
  "title": "Build REST API",
  "description": "Create CRUD endpoints",
  "status": "pending",
  "creator_id": 1,
  "creator_username": "kathir",
  "assigned_to": 2,
  "assigned_to_username": "john",
  "created_at": "2026-06-24T18:30:00",
  "updated_at": "2026-06-24T18:30:00"
}
```

**Errors:**
| Status | Detail |
|---|---|
| 403 | Not authorized to view this task |
| 404 | Task not found |

---

#### `PUT /tasks/{task_id}`

Update a task. Only the creator can update.

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "in progress",
  "assigned_to": 3
}
```

> All fields are optional. Only provided fields are updated.

| Field | Type | Description |
|---|---|---|
| `title` | string | New title |
| `description` | string | New description |
| `status` | string | `pending`, `in progress`, `completed` |
| `assigned_to` | int | Reassign to another user |

**Response (200):**
```json
{ "message": "Task Updated Successfully" }
```

**Errors:**
| Status | Detail |
|---|---|
| 403 | Not authorized to update this task |
| 404 | Task not found / Assigned user not found |

---

#### `DELETE /tasks/{task_id}`

Delete a task. Only the creator can delete.

**Response (200):**
```json
{ "message": "Task deleted Successfully" }
```

**Errors:**
| Status | Detail |
|---|---|
| 403 | Not authorized to delete this task |
| 404 | Task not found |

---

### 📊 Dashboard Endpoint (`/dashboard`)

#### `GET /dashboard/`

Get a summary of all tasks across the system.

**Response (200):**
```json
{
  "total_users": 5,
  "total_tasks": 12,
  "pending_tasks": 4,
  "in_progress_tasks": 5,
  "completed_tasks": 3
}
```

---

## Data Models

### User

| Field | Type | Constraints |
|---|---|---|
| `id` | Integer | Primary Key, Auto |
| `email` | String(50) | Unique, Not Null |
| `username` | String(50) | Not Null |
| `password_hash` | String(225) | Not Null |
| `created_at` | DateTime | Default: now |

### Task

| Field | Type | Constraints |
|---|---|---|
| `id` | Integer | Primary Key, Auto |
| `title` | String(225) | Not Null |
| `description` | Text | Nullable |
| `status` | String(50) | Default: `"pending"` |
| `creator_id` | Integer | FK → Users.id, Not Null |
| `assigned_to` | Integer | FK → Users.id, Nullable |
| `created_at` | DateTime | Default: now |
| `updated_at` | DateTime | Default: now |

---

## Error Responses

All error responses follow this format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

| Status Code | Meaning |
|---|---|
| 400 | Bad Request (validation error, duplicate email) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (not authorized for this resource) |
| 404 | Not Found (resource doesn't exist) |
| 422 | Unprocessable Entity (request body validation) |

---

## License

This project is for learning purposes.
