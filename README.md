
# 📦 Happy Parcel Picker – Parcel Delivery API

[Live App](https://happy-parcel-picker.vercel.app) | [GitHub Repo](https://github.com/pxgacademy/Parcel-Delivery-Web-App-Server)

A secure, modular, and role-based backend API for a parcel delivery platform inspired by services like Pathao Courier and Sundarban. Built with **Express.js**, **MongoDB (Mongoose)**, **Zod**, **JWT**, and **TypeScript**.

---

## ✨ Features

- 🔐 JWT Authentication & Role-based Access (Admin, Sender, Receiver)
- 🧑 Sender & Receiver parcel management
- 🧾 Embedded status tracking with full delivery logs
- ❌ Cancel parcels (before dispatch)
- ✅ Confirm delivery by receivers
- 🚫 Block users or parcels (Admin only)
- 🧱 Modular Code Architecture
- 📄 Auto-generated Tracking ID for each parcel
- 📥 Downloadable parcel invoice (via PDFKit)

---

## 📁 Folder Structure

```bash
src/
├── app/
│   ├── modules/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── parcel/
│   ├── middlewares/
│   ├── constants/
│   ├── utils/       # Shared logic (PDF, logger, validators, etc.)
│   ├── lib/         # DB connection, token, service configs           
├── config/            # Global config (env, server setup)
├── app.ts
└── server.ts
```

---

## 🔐 Authentication & Roles

| Role       | Description                                        |
| ---------- | -------------------------------------------------- |
| `ADMIN`    | Full access to users, parcels, logs, block/unblock |
| `SENDER`   | Can create/cancel/view parcels they send           |
| `RECEIVER` | View/confirm parcels addressed to them             |

---

## 🧪 Local Setup

```bash
# 1. Clone repository
git clone https://github.com/pxgacademy/Parcel-Delivery-Web-App-Server

# 2. Install dependencies
npm install

# 3. Set up .env file
cp .env.example .env  # Fill in values like DB_URI, JWT_SECRET, etc.

# 4. Run dev server
npm dev
```

---

## 🔁 Parcel Status Flow

Each parcel has a status log array stored as a subdocument inside the parcel. Example status flow:

```
Requested → Approved → Dispatched → In Transit → Delivered
```

Each status includes:

* `status`: Enum value
* `timestamp`: Auto-generated
* `note`: Optional remarks
* `updatedBy`: Admin/User ID

---

## 🔗 API Reference

All endpoints are versioned under `/api/v1`.

### 🔐 Auth

| Method | Endpoint                | Description                     |
| ------ | ----------------------- | ------------------------------- |
| POST   | `/auth/login`           | Login and get access token      |
| POST   | `/auth/logout`          | Logout user                     |
| POST   | `/auth/refresh-token`   | Refresh access token            |
| POST   | `/auth/forgot-password` | Email-based password recovery   |
| POST   | `/auth/reset-password`  | Reset password with new one     |
| POST   | `/auth/change-password` | Change password (auth required) |

---

### 👤 User

| Method | Endpoint          | Description                  |
| ------ | ----------------- | ---------------------------- |
| POST   | `/user/register`  | Create user account          |
| GET    | `/user/all-users` | \[Admin] Get all users       |
| GET    | `/user/me`        | \[User] Get own profile      |
| GET    | `/user/:id`       | \[Admin] Get a specific user |
| PATCH  | `/user/:id`       | \[User/Admin] Update profile |

---

### 📦 Parcel

#### Sender

| Method | Endpoint                    | Description               |
| ------ | --------------------------- | ------------------------- |
| POST   | `/parcel/create`            | Create a parcel           |
| PATCH  | `/parcel/update-parcel/:id` | Update parcel details     |
| PATCH  | `/parcel/cancel/:id`        | Cancel parcel             |
| GET    | `/parcel/my-parcels`        | List parcels sent by user |

#### Receiver

| Method | Endpoint                   | Description                   |
| ------ | -------------------------- | ----------------------------- |
| GET    | `/parcel/incoming-parcels` | Get parcels addressed to user |
| PATCH  | `/parcel/confirm/:id`      | Confirm received parcel       |

#### Admin

| Method | Endpoint                               | Description                            |
| ------ | -------------------------------------- | -------------------------------------- |
| GET    | `/parcel/all-parcels`                  | View all parcels                       |
| PATCH  | `/parcel/update-parcel-status/:id`     | Change status (e.g. Dispatch, Approve) |
| PATCH  | `/parcel/update-parcel-status-log/:id` | Update note for a specific status log  |
| DELETE | `/parcel/status/:id`                   | Delete a status log entry              |
| DELETE | `/parcel/:id`                          | Hard delete parcel                     |

---

## 🧾 Parcel Payload Example

```json
{
  "title": "A big box of mango",
  "type": "Box",
  "weight": 60,
  "pickupAddress": {
    "street": "Gohira",
    "stateOrProvince": "Hathazari",
    "city": "Chattogram",
    "postalCode": "4330",
    "country": "Bangladesh"
  },
  "deliveryAddress": {
    "street": "Kazi para",
    "stateOrProvince": "Hathazari",
    "city": "Chattogram",
    "postalCode": "4330",
    "country": "Bangladesh"
  },
  "receiver": "688dd4e0d0d52012503e5d2a"
}
```

---

## 🧭 Postman Collection

📁 [Download & Open in Postman](https://drive.google.com/file/d/1k1t00cUWVbcmDnG8e-933NKzAD4bV2xm/view?usp=sharing)

> Import the collection and follow request examples using pre-filled test tokens. Adjust `Authorization` headers as needed.

---

## 📥 Sample Status Log Payloads

### ✅ Update a status log:

```json
{
  "note": "Status corrected manually",
  "status": "Approved",
  "updatedAt": "2025-08-02T16:20:59.356Z"
}
```

### ❌ Delete a status log:

```json
{
  "deletedStatus": "Delivered",
  "updatedAt": "2025-08-02T10:34:52.609Z",
  "presentStatus": "Approved",
  "note": "Reverted incorrect delivery"
}
```

---

## 💬 Security Notes

* Passwords hashed using `bcryptjs`
* JWT access tokens expire based on `.env` config
* Refresh token support via `/auth/refresh-token`
* Role-based access middleware enforces endpoint restrictions

---

## 🧾 Invoice PDF

PDF invoice generated with [PDFKit](https://pdfkit.org). Admins can download shipment invoice containing parcel metadata and status logs.

---

## Acknowledgements

Built using:

* [Express.js](https://expressjs.com/)
* [MongoDB + Mongoose](https://mongoosejs.com/)
* [Zod](https://zod.dev/)
* [JWT](https://jwt.io/)
* [PDFKit](https://pdfkit.org/)
* [Passport.js](http://www.passportjs.org/)








       █████╗ ██████╗ ██████╗ ██╗   ██╗██╗     ██╗      █████╗ ██╗  ██╗          
      ██╔══██╗██╔══██╗██╔══██╗██║   ██║██║     ██║     ██╔══██╗██║  ██║          
      ███████║██████╔╝██║  ██║██║   ██║██║     ██║     ███████║███████║          
      ██╔══██║██╔══██╗██║  ██║██║   ██║██║     ██║     ██╔══██║██╔══██║          
      ██║  ██║██████╔╝██████╔╝╚██████╔╝███████╗███████╗██║  ██║██║  ██║          
      ╚═╝  ╚═╝╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝          


