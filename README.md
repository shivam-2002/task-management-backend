# Task Management Backend API

This is a **Node.js & Express** backend for a task management system that includes:
- **User Authentication** (Login, Register)
- **JWT Token Verification**
- **Task Management** (Add, Update, Delete, Get All Tasks)
- **MySQL Database Integration**

## 🚀 Features
- **Secure Authentication** using **JWT**
- **CRUD Operations** for Task Management
- **MySQL Database** with relational structure
- **RESTful API Design**

## 📌 Technologies Used
- **Node.js** with **Express.js**
- **MySQL** (with `mysql2` package)
- **bcrypt.js** for password hashing
- **jsonwebtoken** for authentication
- **dotenv** for environment variables

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-username/task-management-backend.git
cd task-management-backend
npm install

## Create .env file based on .env.prod and make appropriate changes

## Setup my-sql database configuration
CREATE DATABASE task_management;
USE task_management;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status BOOLEAN,
    due_date DATE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE
);

npm start
