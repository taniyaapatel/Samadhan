# 🚀 Day 05 – Express.js Basics

This project demonstrates the basics of **Express.js** by building a simple server that serves a static UI and provides a REST API for managing student data.

---

## 📂 Project Structure

Day-05/
┣ 📁 public → Frontend files
┃ ┣ 📄 index.html → HTML UI
┃ ┣ 📄 style.css → Styling
┃ ┗ 📄 script.js → Frontend logic
┣ 📄 server.js → Express.js server
┣ 📄 package.json → Project metadata & dependencies
┣ 📄 package-lock.json → Dependency lock file
┗ 📄 .gitignore → Ignored files (node_modules, etc.)


---

## ✨ Features
- Serves static frontend from the `public/` folder
- Provides a **REST API** to manage students
- `GET /api/students` → Returns list of students
- `POST /api/students` → Adds a new student
- Handles errors for duplicate IDs or missing fields
- SPA-friendly: always serves `index.html` for unknown routes

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Frontend:** HTML, CSS, JavaScript

---

## 🚦 Getting Started

### Step 1: Install Dependencies
```bash
npm install

By default, the server runs at:
👉 http://localhost:3000

## 📸 Screenshot

![UI Screenshot](./assets/ui.png)

