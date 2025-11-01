🍬 Sweet Shop Management System (Full-Stack TDD Kata)

Status

Development Stage

Backend

Frontend

Testing

Complete

Full-Stack Web App

Node.js (Express)

React (SPA)

TDD with Jest/Supertest

📜 1. Project Overview

The Sweet Shop Management System is a full-stack web application developed as a TDD (Test-Driven Development) Kata. Its primary goal is to provide a secure and efficient platform for managing sweet inventory, processing sales, and handling user authentication for a retail environment.

This project demonstrates strong foundational skills in API design, database persistence, modern frontend development, security implementation, and systematic testing.

✨ 2. Key Features and Objectives

The application is built to meet the core requirements outlined in the project specification:

🎯 Core Objectives

Implement a RESTful API in Node.js/Express.

Enforce Token-Based Authentication (JWT) for all protected routes.

Maintain persistence using a MongoDB database.

Develop a responsive Single-Page Application (SPA) using React.

Adhere strictly to Test-Driven Development (TDD) principles.

💼 Key Features

User Management: Secure user registration (RegisterPage.js) and login (LoginPage.js).

Inventory CRUD: Forms and UI (AdminForm.js) for Admin users to Add, View, Update, and Delete sweets.

Real-Time Stock: Display of all available sweets (DashboardPage.js / SweetList.js) with stock status.

Sales Processing: Protected endpoints for purchasing sweets, decrementing quantity.

Admin Tools: Dedicated panel (AdminPanelPage.js) for administrative functions like restock and user management.

Search & Filter: Functionality to search inventory by name, category, or price range.

💻 3. Technologies Used

The project follows a Monorepo pattern with separate backend and frontend directories.

Category

Technology

Purpose

Backend

Node.js / Express

Fast, minimal server and RESTful API framework.

Database

MongoDB

NoSQL database for flexible persistence.

Security

bcryptjs & jsonwebtoken

Password hashing and JWT token generation/validation.

Frontend

React

Modern library for building the SPA UI.

State Mgt.

React Context

Global state management for user authentication (AuthContext.js).

Testing

Jest / Supertest

Used for TDD workflow (unit and API integration tests).

🧠 4. System Architecture & Workflow

The system is organized into a modular structure to ensure maintainability and separation of concerns.

Backend (backend/)

The API follows a standard architecture: Routes → Middleware → Models.

Routes (routes/auth.js, routes/sweets.js, routes/admin.js) define the API endpoints.

Middleware (middleware/auth.js, middleware/checkAuth.js) handles JWT verification and role-based access control before reaching the core logic.

Config (config/db.js) manages the MongoDB connection using a library like Mongoose or the native driver.

Frontend (frontend/)

The React application uses a typical component-driven approach:

Context: AuthContext.js provides user and authentication status globally.

Pages: Top-level components (DashboardPage.js, AdminPanelPage.js) define the layout and navigation.

Components: Reusable UI elements (SweetCard.js, SearchBar.js).

Services: api.js centralizes all fetch requests to the backend.

🚀 5. Installation and Setup Instructions

Follow these steps to get the project running on your local machine.

🔹 Prerequisites

Ensure you have:

Node.js (LTS) and npm installed.

A running MongoDB instance (local or cloud like MongoDB Atlas).

🔹 Step 1: Clone the Repository

git clone [YOUR_REPO_URL]
cd sweet-shop-kata





🔹 Step 2: Backend Installation and Setup

Navigate to the backend directory, install dependencies, and create the .env file.

cd backend
npm install mongoose # Assuming Mongoose or similar library is used
npm install

# Create .env file for secrets
# touch .env





Example .env Content (in backend/):

PORT=3000
JWT_SECRET=YOUR_RANDOM_SECRET_KEY
MONGO_URI=mongodb://localhost:27017/sweetshopdb # YOUR MONGODB CONNECTION STRING




🔹 Step 3: Frontend Installation

Navigate to the frontend directory and install dependencies.

cd ../frontend
npm install





▶️ 6. How to Run the Project

You must run the backend and frontend simultaneously in separate terminal windows.

1. Start the Backend Server

From the backend/ directory:

npm run dev
# Server running on http://localhost:3000





(The backend will attempt to connect to the MongoDB instance specified in the .env file.)

2. Start the Frontend Application

From the frontend/ directory:

npm start
# Application running on http://localhost:3001





🧪 7. Testing Information

This project was built using TDD, meaning tests were written before implementation.

Run Backend Tests

From the backend/ directory:

npm test





The test suite utilizes Jest for the runner and Supertest to mock and verify HTTP requests against the Express API. Coverage reports (e.g., coverage/lcov-report/) are generated upon test execution.

🖼️ 8. Screenshots

(Please replace these placeholders with actual images of your running application, demonstrating the features below.)

1. User Authentication

A screenshot showing the Login or Registration page.

2. Dashboard View

A screenshot of the main sweet list, showing filtering/search functionality.

3. Admin Panel

A screenshot of the AdminPanelPage.js showing the inventory management form.

🤖 9. AI Assistance & Acknowledgment

This project adheres to the AI usage guidelines specified in the Kata. AI tools were leveraged to enhance the TDD workflow and accelerate development.

🛠️ AI Tools Used:

Gemini (Google's AI Assistant)

$$Other tool, e.g., GitHub Copilot$$

$$$$$$$$

📝 Reflection:

AI was instrumental in generating initial Jest and Supertest test boilerplate, drafting MongoDB schema definitions and Mongoose methods, and assisting with the React Context logic (AuthContext.js) to ensure secure state management. This allowed for immediate focus on the critical business logic of the inventory system. All AI-assisted commits were tagged as co-authored.

✒️ 10. Author and License Information

Author

Gowthami

https://github.com/Gowthami-shankar

License

This project is licensed under the MIT License - see the LICENSE.md file for details.