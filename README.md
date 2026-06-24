# Task Management API

A backend Task Management System built using FastAPI, PostgreSQL, SQLAlchemy, and JWT Authentication. This project provides secure user authentication and complete CRUD operations for managing tasks.

## Features

* User Registration
* User Login
* Password Hashing using Passlib
* JWT Authentication
* Create Tasks
* Get All Tasks
* Get Task By ID
* Update Tasks
* Delete Tasks
* PostgreSQL Database Integration
* Swagger API Documentation

## Tech Stack

* Python
* FastAPI
* PostgreSQL
* SQLAlchemy
* Pydantic
* Passlib
* Python-JOSE (JWT)
* Uvicorn

## API Endpoints

### Authentication

| Method | Endpoint       | Description             |
| ------ | -------------- | ----------------------- |
| POST   | /auth/register | Register a new user     |
| POST   | /auth/login    | Login and get JWT token |

### Tasks

| Method | Endpoint         | Description    |
| ------ | ---------------- | -------------- |
| POST   | /tasks/          | Create a task  |
| GET    | /tasks/          | Get all tasks  |
| GET    | /tasks/{task_id} | Get task by ID |
| PUT    | /tasks/{task_id} | Update a task  |
| DELETE | /tasks/{task_id} | Delete a task  |

## How to Run

### Clone Repository

```bash
git clone https://github.com/kathirkamadurai29/Task_management.git
cd Task_management
```

### Create Virtual Environment

```bash
uv venv
```

### Install Dependencies

```bash
uv sync
```

### Run Application

```bash
uv run uvicorn app.main:app --reload
```

### Open Swagger Documentation

```text
http://127.0.0.1:8000/docs
```

## Author

Kathir Kamadurai

Aspiring Backend Developer interested in FastAPI, PostgreSQL, Backend Development, and System Design.
