# 📘 Node.js Learning Page



![Implementation](https://res.cloudinary.com/doxmvuss9/image/upload/v1756263867/link-generator/t5w8xirehxgcvcbbuuui.png)

![API + Frontend](https://res.cloudinary.com/doxmvuss9/image/upload/v1756264147/link-generator/vz1pcs3o9s3v4z7snwgs.png)

An interactive learning webpage to understand **Node.js basics, npm, HTTP servers, and APIs** with explanations and a **Mini Task: Build an API + Frontend**.

---

## 🚀 Features
- 📖 **Documentation**:
  - What is Node.js
  - `npm init` in detail (package.json + alternatives to `npm install`)
  - Creating a **simple HTTP server**
- 🎯 **Mini Task**:
  - Build a `Hello World` API with Node.js
  - Create a frontend page that fetches and displays API data
- 🛠 **Hands-on code samples** included inside project

---

## 📖 Documentation

### 1️⃣ What is Node.js?
- Node.js is an **open-source, cross-platform runtime** for running JavaScript outside the browser.
- Built on **Google Chrome’s V8 Engine**.
- Enables building **fast, scalable, event-driven servers**.
- Common uses:
  - Web servers & APIs 🌐
  - Real-time apps (Chat, Gaming) ⚡
  - Tools & scripts 🔧
  - Streaming services 🎥
  - IoT & microservices 🌍

---

### 2️⃣ `npm init` Explained
- Running `npm init` creates a **package.json** file.
- **package.json** stores project metadata:
  - Name, version, description
  - Scripts (start, build, test)
  - Dependencies & devDependencies

📦 Example:
```json
{
  "name": "my-node-app",
  "version": "1.0.0",
  "description": "Learning Node.js",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {}
}
```