# Full Stack Parcel Delivery Web App

This is a **Full Stack Parcel Delivery Management System** built with **React (frontend)** and **Express.js (backend)**.
It allows users to **create, track, and manage parcel deliveries** with role-based dashboards for **Senders**, **Receivers**, and **Admins**.

---

## Project Overview

This system aims to simplify the process of sending, tracking, and managing parcels through a modern, responsive web application.
It includes secure authentication, real-time status updates, and admin control features for effective parcel management.

The project is divided into two main parts:

| Folder      | Description                                                          |
| ----------- | -------------------------------------------------------------------- |
| **/client** | React frontend built with Redux Toolkit, RTK Query, and Tailwind CSS |
| **/server** | Node.js + Express backend API with MongoDB and JWT authentication    |

---

## Live Demo

| Service               | URL                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| **Frontend (Client)** | [https://happy-parcel-picker.netlify.app](https://happy-parcel-picker.netlify.app)             |
| **Backend (Server)**  | [https://happy-parcel-picker-server.vercel.app](https://happy-parcel-picker-server.vercel.app) |

---

## Repositories

This GitHub repository contains both frontend and backend code:

**GitHub:** [https://github.com/apropex/Full-Stack-Parcel-Delivery-Web-App](https://github.com/apropex/Full-Stack-Parcel-Delivery-Web-App)

---

## Technology Stack

- **Frontend:** React, Redux Toolkit, RTK Query, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT
- **Deployment:** Netlify (Frontend), Vercel (Backend)

---

## Folder Structure

```
Full-Stack-Parcel-Delivery-Web-App/
│
├── client/          # Frontend application (React + Redux Toolkit)
│   └── README.md    # Frontend-specific documentation
│
├── server/          # Backend API (Express + MongoDB)
│   └── README.md    # Backend-specific documentation
│
└── README.md        # Root-level overview (this file)
```

---

## How to Run Locally

1. **Clone the Repository**

   ```bash
   git clone https://github.com/apropex/Full-Stack-Parcel-Delivery-Web-App.git
   cd Full-Stack-Parcel-Delivery-Web-App
   ```

2. **Setup and Run the Backend**

   ```bash
   cd server
   npm install
   npm run dev
   ```

3. **Setup and Run the Frontend**

   ```bash
   cd ../client
   npm install
   npm run dev
   ```

4. **Access the App**

   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend: [http://localhost:5000](http://localhost:5000) (or as configured)
