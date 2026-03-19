# 🚀 Task Management Dashboard

A modern, fully responsive **Task Management Dashboard** built using **React.js**, focused on clean architecture, scalable code, and real-world UI/UX practices.

---

## ✨ Overview

This application allows users to manage and explore **Users, Tasks, and Posts** using live data from public APIs. It demonstrates strong frontend fundamentals including **API integration, reusable components, custom hooks, and robust error handling**.

---

## 🧩 Features

### 📊 Dashboard

* Summary cards (Users, Tasks, Completed, Pending)
* Animated UI elements
* Data visualization (charts)
* Quick overview of system data

---

### 👤 Users Module

* List all users
* Search users
* View detailed user information
* Task summary per user

---

### ✅ Tasks Module

* List all tasks
* Filter by user
* Filter by completion status
* Search tasks by title
* Dedicated Task Detail page

  * Assigned user info
  * Related tasks

---

### 📝 Posts Module

* List all posts
* Display comment counts efficiently
* Optimized API usage

---

## ⚡ Advanced Features

* 🔄 Custom `useFetch` hook

  * API fetching
  * Loading states
  * Error handling
  * Retry functionality
  * Auto-retry on network reconnect

* 🧠 ErrorBoundary for catching runtime crashes

* 🌐 NetworkBanner (online/offline detection)

* 🔝 ScrollToTop for smooth navigation

* 🚫 NotFound page for unknown routes

* ⏳ Skeleton loading states

---

## 🎨 UI/UX Highlights

* Fully responsive (Desktop / Tablet / Mobile)
* Sidebar navigation (desktop)
* Mobile bottom navigation
* Clean SaaS-style UI
* Consistent purple-themed design
* CSS Grid layout + custom breakpoints
* Smooth transitions and animations

---

## 🛠️ Tech Stack

* React.js (Vite)
* Tailwind CSS
* Axios
* React Router DOM
* Recharts
* Lucide React Icons

---

## 🔗 API Used

* https://jsonplaceholder.typicode.com/users
* https://jsonplaceholder.typicode.com/todos
* https://jsonplaceholder.typicode.com/posts
* https://jsonplaceholder.typicode.com/comments

---

## 📁 Project Structure

```id="p8v0p9"
src/
├── components/
├── hooks/
├── pages/
├── services/
└── App.jsx
```

---

## ⚙️ Installation & Setup

```id="m7l0c1"
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
npm run dev
```

---

## 🎯 Key Highlights

* Clean and modular architecture
* Reusable components and hooks
* Efficient API handling
* Focus on user experience and performance
* Real-world dashboard design approach

---

## 📸 Screenshots

*(Dashboard, Tasks, Users, Mobile view)*

### Dashboard
<img width="1440" height="812" alt="Screenshot 2026-03-20 at 2 30 43 AM" src="https://github.com/user-attachments/assets/b6163cfb-931f-4d1d-808d-6b4a0c924671" />

### Users
<img width="1440" height="814" alt="Screenshot 2026-03-20 at 2 31 26 AM" src="https://github.com/user-attachments/assets/a459db05-107c-46ac-bbcc-cf4ecd1054ac" />

### Tasks
<img width="1440" height="812" alt="Screenshot 2026-03-20 at 2 31 39 AM" src="https://github.com/user-attachments/assets/8d353dfc-8500-4e51-b221-f5eda09b47a0" />

### Posts
<img width="1440" height="812" alt="Screenshot 2026-03-20 at 2 31 49 AM" src="https://github.com/user-attachments/assets/d2a39f20-d14d-4e51-88a5-5b4e1cc39b3c" />

### Mobile View
<img width="149" height="269" alt="Screenshot 2026-03-20 at 2 34 46 AM" src="https://github.com/user-attachments/assets/bdd83229-a8ea-41c9-aa87-ca2453a7ffd3" />

---

## 🚀 Future Improvements

* Pagination & sorting
* Dark mode
* Global state management (Redux / Context API)
* Unit testing

---

## 👨‍💻 Author

**Harsh Mehta**

---

## 📌 Note

This project was built as part of a frontend assignment to demonstrate React skills, including API integration, UI/UX design, and scalable application structure.
