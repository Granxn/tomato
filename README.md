# 🍅 Tomato — Productivity Companion

**Live Demo: https://tomato-six-xi.vercel.app**
**Repository: https://github.com/Granxn/tomato**

![Vercel](https://img.shields.io/badge/Deployment-Vercel-black?style=flat-square&logo=vercel)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styling-blue?style=flat-square&logo=tailwindcss)

---

## ⭐ Project Overview

Tomato is a modern, full-stack productivity web app designed to help users focus and manage tasks effectively. It combines the **Pomodoro Technique** with a persistent **Task Management** system, all wrapped in a clean, soft-themed, and responsive UI.

This project is built using the **Next.js 14 App Router**, featuring server-side logic and client-side interactivity, with **Supabase** acting as the complete backend for authentication and database storage.

---

## ✨ Key Features

* **User Authentication:** Secure login and registration handled by **Supabase Auth**.
* **Persistent Task Management:** Full CRUD (Create, Read, Update, Delete) functionality for tasks. All tasks are saved to a **PostgreSQL** database (via Supabase) and are tied to the specific user.
* **Focus Timer:** A classic Pomodoro timer (25 min) to help users manage work intervals.
* **Modern UI/UX:** A clean, responsive design using a hybrid styling approach.
* **Separate Themes:** Features a distinct, colorful theme for the Login page and a calming pink/peach theme for the main Dashboard.

---

## 🛠 Tech Stack & Architecture

This project demonstrates a modern full-stack architecture. The file structure (`/app`, `tailwind.config.js`, `/lib/supabase.js`) reveals a clear separation of concerns:

* **Frontend:**
    * **Next.js 14:** Used for its **App Router**, enabling Server Components and protected routes (e.g., the `/dashboard` page).
    * **TypeScript:** For type safety and improved developer experience.
    * **Tailwind CSS:** (From `tailwind.config.js`) Used for utility-first styling and rapid UI development.
    * **CSS Modules:** (From `*.module.css` files) Used alongside Tailwind for component-level, scoped styling, especially for the main dashboard and login pages.

* **Backend & Database:**
    * **Supabase:** Acts as the complete Backend-as-a-Service (BaaS).
        * **Supabase Auth:** Manages all user authentication.
        * **Supabase Database:** Provides the **PostgreSQL** database, with the schema defined in `supabase-schema.sql`.
    * **Client Connection:** The `/lib/supabase.js` file likely handles the creation of the Supabase client for interacting with the backend.

* **Deployment:**
    * **Vercel:** Deployed via Vercel, optimized for Next.js applications.

---

## 📸 Screenshots

| Login Page | Main Dashboard |
| :---: | :---: |
| <img src="/public/images/login.png" alt="Tomato Login Page" width="400"> | <img src="/public/images/dashboard.png" alt="Tomato Main Dashboard" width="400"> |
| **Add New Task Modal** | **Task List Management** |
| <img src="/public/images/AddNewTask.png" alt="Add New Task Modal" width="400"> | <img src="/public/images/task.png" alt="Task List Management" width="400"> |

---

## 🚀 How to Run Locally

1.  Clone the repository:
    ```bash
    git clone [https://github.com/Granxn/tomato.git](https://github.com/Granxn/tomato.git)
    cd tomato
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    * Create a file named `.env.local` in the root directory.
    * (จากไฟล์ `.env.local` และ `/lib/supabase.js`) คุณต้องใช้ Key จาก Supabase:
    ```.env
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💡 Learning Outcomes

* Building a full-stack application from scratch using the Next.js 14 App Router.
* Implementing secure user authentication and database management with Supabase.
* Designing and managing a PostgreSQL database schema (`supabase-schema.sql`).
* Applying a hybrid styling strategy combining Tailwind CSS for utilities and CSS Modules (`*.module.css`) for complex, scoped components.
* Managing application state and data fetching in a server-centric framework.
