# Surplus Food Reduction and Redistribution System
---

# Food Donation Platform

A comprehensive full-stack web application to facilitate food donations, connecting donors, operating managers, and partner organizations. The platform streamlines donation management, real-time communication, analytics, and reporting, aiming to reduce food waste and help communities in need.

---

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Development Scripts](#development-scripts)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

### Donor Portal
- Register and manage your profile.
- Create, edit, and delete food donations.
- Track donation status in real-time.
- View donation history and achievements.
- Search and filter donations.

### Operating Manager Dashboard
- Manage and monitor all donations.
- View and update donor and partner profiles.
- Real-time chat with donors and partners.
- Generate and download analytics/PDF reports.
- Manage partner organization requests.

### Partner Management
- Collaborate with partner organizations.
- Approve or reject partnership requests.
- View partner details and manage interactions.

### General
- Responsive modern UI (React).
- Authentication and authorization (JWT).
- Real-time updates (Socket.io).
- PDF export with charts and tables (jsPDF).
- Robust error handling and user feedback.

---

## Screenshots

> _Add screenshots/gifs here to showcase the main features and UI._

---

## System Architecture


- **Frontend**: User interface for donors, operating managers, and partners.
- **Backend**: REST API, authentication, business logic, real-time events.
- **Database**: MongoDB for storing users, donations, requests, and messages.

---

## Tech Stack

- **Frontend**: React, JavaScript, CSS Modules
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose ODM)
- **Real-time**: Socket.io
- **HTTP Requests**: Axios
- **PDF Generation**: jsPDF, jsPDF-AutoTable
- **Authentication**: JWT
- **Charting**: Chart.js (for analytics in PDF)
- **Other**: dotenv, cors, bcrypt

---

## Project Structure


---

## Installation & Setup

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB (local or Atlas cloud)

### 1. Clone the repository

```bash
git clone [https://github.com/yourusername/food-donation-platform.git](https://github.com/yourusername/food-donation-platform.git)
cd food-donation-platform

PORT=8090
MONGODB_URI=mongodb://localhost:27017/food-donation
JWT_SECRET=your_jwt_secret

REACT_APP_API_URL=http://localhost:8090
