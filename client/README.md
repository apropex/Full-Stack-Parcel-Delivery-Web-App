# Parcel Delivery Frontend (React + Redux Toolkit + RTK Query)

## Overview

**Happy Parcel Picker** is a full-stack **Parcel Delivery Management System** designed to simplify parcel creation, tracking, and delivery management for different types of users — **Senders**, **Receivers**, and **Admins**.

This repository contains the **frontend application**, built with **React**, **Redux Toolkit**, and **RTK Query**, and connected to a secure **Node.js/Express** backend API.
The system emphasizes **role-based access**, **secure authentication**, and a **modern responsive interface** optimized for usability and scalability.

---

## Project Objectives

- Develop a secure and dynamic parcel delivery platform with modern frontend technologies.
- Implement **role-based authentication and authorization**.
- Manage parcel operations efficiently through **state management** and **data fetching** with RTK Query.
- Deliver an **intuitive, responsive, and accessible user experience**.
- Create a scalable codebase for future enhancements and feature expansions.

---

## Live Links

| Type                  | URL                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Client (Frontend)** | [https://happy-parcel-picker.netlify.app](https://happy-parcel-picker.netlify.app)                                             |
| **Server (Backend)**  | [https://happy-parcel-picker-server.vercel.app](https://happy-parcel-picker-server.vercel.app)                                 |
| **GitHub Repository** | [https://github.com/apropex/Full-Stack-Parcel-Delivery-Web-App](https://github.com/apropex/Full-Stack-Parcel-Delivery-Web-App) |

---

## Key Features

### 1. Public Section

- Home, About, and Contact pages with clear service information.
- Simulated contact form submission.

### 2. Authentication

- Register and log in with role selection (**Sender** or **Receiver**).
- JWT-based authentication with refresh tokens.
- Persistent login (user remains logged in after refresh).
- Secure cookie handling and logout functionality.

### 3. Sender Dashboard

- Create parcel delivery requests.
- Cancel pending parcels.
- View and track all created parcels with detailed status logs.

### 4. Receiver Dashboard

- View incoming parcels.
- Confirm parcel deliveries.
- Review delivery history and parcel statuses.

### 5. Admin Dashboard

- View and manage all users (block/unblock).
- Manage all parcels (update, cancel, or change delivery status).
- Optional assignment of delivery personnel.

### 6. Parcel Tracking

- Search parcels by **unique tracking ID**.
- Display detailed tracking information with timestamps and notes.

### 7. UI & General Features

- Role-based navigation and protected routes.
- Global error handling and loading indicators.
- Pagination, filtering, and search functionalities.
- Toast notifications for quick user feedback.
- Data visualizations (charts, parcel statistics).
- Fully responsive, clean, and consistent design.

---

## Technology Stack

### Frontend

- React.js
- Redux Toolkit & RTK Query
- TypeScript
- React Router DOM
- Tailwind CSS

### Backend

- Node.js / Express.js
- MongoDB / Mongoose
- JWT & bcrypt (authentication and password encryption)

---

## Benefits

- **Efficiency:** Digitalizes parcel management operations for all user roles.
- **Security:** Cookie-based JWT authentication ensures data protection.
- **Scalability:** Modular and maintainable architecture.
- **Performance:** Optimized API handling through RTK Query caching.
- **User Experience:** Clean, responsive UI with seamless navigation.

---

## Future Enhancements

- Real-time parcel tracking using WebSockets.
- Delivery personnel management for Admins.
- Payment gateway integration for prepaid parcels.
- Email/SMS notifications for parcel status updates.
- Dark mode and multi-language support.
- PWA (Progressive Web App) features for offline access.

---

## Installation & Setup

### Prerequisites

Ensure the following tools are installed:

- Node.js (v18 or later)
- npm or yarn
- Git

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/apropex/Full-Stack-Parcel-Delivery-Web-App.git
   ```

2. **Navigate to the frontend directory**

   ```bash
   cd Full-Stack-Parcel-Delivery-Web-App/client
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

4. **Configure environment variables**
   Create a `.env` file in the root directory and add:

   ```
   VITE_API_BASE_URL=https://happy-parcel-picker-server.vercel.app
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

   The app will run locally at:

   ```
   http://localhost:5173
   ```

---

## Deployment

### Platforms Used

- **Frontend:** Netlify
- **Backend:** Vercel

### Deployment Notes

- Environment variables are configured directly in deployment dashboards.
- HTTPS is enabled to support secure cookie transmission.

---

## User Guide

### User Roles

| Role         | Access                                     |
| ------------ | ------------------------------------------ |
| **Sender**   | Create, cancel, and track parcels          |
| **Receiver** | Confirm deliveries and view parcel history |
| **Admin**    | Manage all users and parcels               |

<!-- ### Test Credentials

| Role     | Email                                         | Password |
| -------- | --------------------------------------------- | -------- |
| Admin    | [admin@test.com](mailto:admin@test.com)       | 123456   |
| Sender   | [sender@test.com](mailto:sender@test.com)     | 123456   |
| Receiver | [receiver@test.com](mailto:receiver@test.com) | 123456   | -->

### How to Use

1. Register or log in using the credentials above.
2. Explore the dashboard based on your role.
3. Use the sidebar for navigation.
4. View statistics, parcel logs, and perform actions directly from the dashboard.

---

## Project Structure

```
parcel-delivery-frontend/
│
├── src/
│   ├── app/                # Redux store configuration
│   ├── features/           # RTK Query API slices and state slices
│   ├── components/         # Reusable UI components
│   ├── pages/              # Role-based and public pages
│   ├── routes/             # Route and layout setup
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Helper functions
│   ├── assets/             # Static files and icons
│   └── main.tsx            # Application entry
│
├── public/                 # Static assets
├── .env.example            # Sample environment variables
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json
```

---

## API Base URL

All data is fetched from the backend hosted at:

```
https://happy-parcel-picker-server.vercel.app/api
```

Example Endpoints:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/parcels`
- `POST /api/parcels`
- `PATCH /api/parcels/:id`
- `GET /api/users`
