# 🍬 Sweet Shop Management System (Full-Stack TDD Kata)

## 📜 1. Project Overview

The Sweet Shop Management System is a full-stack web application
developed as a TDD (Test-Driven Development) Kata. Its primary goal is
to provide a secure and efficient platform for managing sweet inventory,
processing sales, and handling user authentication for a retail
environment.

This project demonstrates strong foundational skills in API design,
database persistence, modern frontend development, security
implementation, and systematic testing.

## ✨ 2. Key Features and Objectives

The application is built to meet the core requirements outlined in the
project specification:

### 🎯 Core Objectives

-   Implement a RESTful API in Node.js/Express.
-   Enforce Token-Based Authentication (JWT) for all protected routes.
-   Maintain persistence using a MongoDB database.
-   Develop a responsive Single-Page Application (SPA) using React.
-   Adhere strictly to Test-Driven Development (TDD) principles.

### 💼 Key Features

-   **User Management:** Secure user registration and login.
-   **Inventory CRUD:** Admin users can Add, View, Update, and Delete
    sweets.
-   **Real-Time Stock:** Display of all available sweets with stock
    status.
-   **Sales Processing:** Protected endpoints for purchasing sweets.
-   **Admin Tools:** Restock and inventory control.
-   **Search & Filter:** Search inventory by name, category, or price
    range.

## 💻 3. Technologies Used

  -----------------------------------------------------------------------
  Category               Technology                  Purpose
  ---------------------- --------------------------- --------------------
  Backend                Node.js / Express           RESTful API
                                                     framework

  Database               MongoDB                     NoSQL database for
                                                     persistence

  Security               bcryptjs & jsonwebtoken     Password hashing and
                                                     JWT verification

  Frontend               React                       UI development

  State Mgt.             React Context               Global auth
                                                     management

  Testing                Jest / Supertest            TDD workflow
  -----------------------------------------------------------------------

## 🧠 4. System Architecture & Workflow

The system follows a modular structure for maintainability.

### Backend (backend/)

-   Routes → Middleware → Models.
-   Middleware handles JWT verification and role-based access control.
-   Config manages MongoDB connection.

### Frontend (frontend/)

-   **Context:** AuthContext.js provides authentication globally.
-   **Pages:** DashboardPage.js, AdminPanelPage.js.
-   **Components:** Reusable UI like SweetCard.js, SearchBar.js.
-   **Services:** api.js centralizes backend calls.

## 🚀 5. Installation and Setup Instructions

### 🔹 Prerequisites

-   Node.js and npm installed
-   MongoDB instance (local or Atlas)

### 🔹 Step 1: Clone the Repository

``` bash
git clone [YOUR_REPO_URL]
cd sweet-shop-kata
```

### 🔹 Step 2: Backend Setup

``` bash
cd backend
npm install
touch .env
```

Example `.env` file:

    PORT=3000
    JWT_SECRET=YOUR_SECRET_KEY
    MONGO_URI=YOUR_MONGODB_CONNECTION_STRING

### 🔹 Step 3: Frontend Setup

``` bash
cd ../frontend
npm install
```

## ▶️ 6. How to Run the Project

### Start Backend

``` bash
npm run dev
```

Backend runs on: `http://localhost:3000`

### Start Frontend

``` bash
npm start
```

Frontend runs on: `http://localhost:3001`

## 🧪 7. Testing Information

Run backend tests:

``` bash
npm test
```

Uses Jest and Supertest for unit and integration tests.

## 🤖 8. AI Assistance & Acknowledgment

This project adheres to AI usage guidelines.\
AI tools (like Gemini) assisted in drafting test logic, schema design,
and frontend auth logic.

## ✨ 9. Reflection

AI helped speed up TDD workflow and ensure code reliability.

------------------------------------------------------------------------

## 📸 10. Screenshots

Below are the visual highlights of the **Sweet Shop Management System**,  
demonstrating both frontend UI and backend functionality.  
All screenshots are stored inside the repository at:  
`sweet-shop/screenshots/`

---

### 🧾 **User Registration Page**
![Register Page](https://github.com/Gowthami-shankar/Sweet-Shop/blob/master/screenshots/Screenshot%202025-11-02%20141542.png?raw=true)
> This page allows new users to create an account by entering their username, password, and role (Customer or Admin).  
> The registration form ensures validation and secure data submission through the backend API.

---

### 🧁 **Admin Panel – Add & Manage Sweets**
![Admin Panel](https://github.com/Gowthami-shankar/Sweet-Shop/blob/master/screenshots/Screenshot%202025-11-02%20160909.png?raw=true)
> Admin users can view, add, edit, and delete sweets.  
> The dashboard shows stock quantities, pricing, and categories.  
> Each card displays a sweet's details with edit and delete controls.

---

### 🛒 **User Dashboard – Sweet Listings**
![User Dashboard](https://github.com/Gowthami-shankar/Sweet-Shop/blob/master/screenshots/Screenshot%202025-11-02%20161039.png?raw=true)
> Logged-in users can browse sweets.  
> The layout displays names, prices, and stock counts.  
> Demonstrates the app's **reactive data flow** between backend and frontend.

---

### 🔍 **Search & Filter Functionality**
![Search & Filter](https://github.com/Gowthami-shankar/Sweet-Shop/blob/master/screenshots/Screenshot%202025-11-02%20161113.png?raw=true)
> Users can search sweets by name, category, and price range.  
> Results update dynamically, improving the user experience.

---




## ✒️ 11. Author and License Information

**Author:**\
Gowthami\
[GitHub Profile](https://github.com/Gowthami-shankar)

**License:**\
This project is licensed under the **MIT License** --- see the
`LICENSE.md` file for details.

------------------------------------------------------------------------
