# LMS Project Frontend

This is the frontend client for the Learning Management System (LMS). It is built with React using Vite and TailwindCSS.

## Features
- Student, Teacher, and Admin Dashboards
- Video Player & Course Consumption
- Syllabus & Resource Views
- Placement Drive listings
- Fast & Responsive UI

## Prerequisites
- Node.js (v18+ recommended)

## Setup & Installation

1.  **Clone the repository**.
2.  **Navigate to frontend directory**:
    ```bash
    cd frontend
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Environment Variables**:
    Create a `.env` file based on `.env.example`:
    ```env
    VITE_API_BASE_URL=http://localhost:8000
    ```
5.  **Start Development Server**:
    ```bash
    npm run dev
    ```

## Deployment (Vercel)

1.  Import the project in Vercel.
2.  **Root Directory**: `frontend`
3.  **Framework Preset**: Vite
4.  **Environment Variables**:
    - `VITE_API_BASE_URL`: The URL of your deployed backend on Render (e.g., `https://your-backend.onrender.com`).
5.  Deploy!
