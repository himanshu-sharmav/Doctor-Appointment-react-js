# Doctor Appointment Management System

A comprehensive full-stack web application for managing doctor appointments, built with React.js and Node.js.

## 🚀 Live Demo

[![Demo](https://img.shields.io/badge/Demo-Live-brightgreen?logo=netlify)](https://doctor-appointment-demo.netlify.app/)

## 📋 Project Overview

This is a **Doctor Appointment Management System** developed as a college project for demonstrating full-stack web development skills. The application provides a complete solution for managing doctor-patient appointments, including user authentication, appointment booking, prescription management, and more.

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login
- Role-based access control (Admin, Doctor, Patient)
- JWT token-based authentication
- Password reset functionality

### 👨‍⚕️ Doctor Management
- Doctor profile creation and management
- Specialization and qualification details
- Availability scheduling
- Patient appointment management
- Prescription writing

### 👥 Patient Management
- Patient registration and profiles
- Appointment booking
- Medical history tracking
- Prescription viewing
- Doctor reviews and ratings

### 📅 Appointment System
- Real-time appointment booking
- Schedule management
- Appointment status tracking
- Payment integration
- Email notifications

### 💊 Medical Records
- Prescription management
- Medicine tracking
- Medical history
- Follow-up scheduling

### 📱 User Interface
- Responsive design
- Modern UI/UX
- Cross-platform compatibility
- Intuitive navigation

## 🛠️ Technology Stack

### Frontend
- **React.js** - User interface framework
- **Redux Toolkit** - State management
- **Ant Design** - UI component library
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Programming language
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Nodemailer** - Email service

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Vercel** - Backend deployment
- **Netlify** - Frontend deployment

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/doctor-appointment-system.git
   cd doctor-appointment-system
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd api
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` files in both root and api directories:
   
   **Frontend (.env.development)**
   ```env
   REACT_APP_NODE_ENV=development
   REACT_APP_API_BASE_URL=http://localhost:5050/api/v1
   ```
   
   **Backend (api/.env)**
   ```env
   DATABASE_URL=your_postgresql_connection_string
   PORT=5050
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret
   EMAIL_PASS=your_email_password
   ```

4. **Database Setup**
   ```bash
   cd api
   npx prisma generate
   npx prisma db push
   npm run seed
   ```

5. **Run the application**
   ```bash
   # Terminal 1 - Backend
   cd api
   npm run dev
   
   # Terminal 2 - Frontend
   npm start
   ```

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:
- **Users** - Authentication and role management
- **Doctors** - Medical professional profiles
- **Patients** - Patient information and history
- **Appointments** - Booking and scheduling
- **Prescriptions** - Medical prescriptions
- **Reviews** - Patient feedback and ratings

## 🔑 Default Login Credentials

After running the seed script, you can use these test accounts:

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`

**Doctors:**
- Email: `sarah.johnson@example.com`
- Password: `doctor123`

**Patients:**
- Email: `john.smith@example.com`
- Password: `patient123`

## 📁 Project Structure

```
doctor-appointment-system/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── redux/             # State management
│   ├── helpers/           # Utility functions
│   └── utils/             # Helper utilities
├── api/                   # Backend source code
│   ├── src/               # TypeScript source
│   ├── prisma/            # Database schema
│   └── template/          # Email templates
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🧪 Testing

```bash
# Frontend tests
npm test

# Backend tests
cd api
npm test
```

## 🚀 Deployment

### Frontend (Netlify)
1. Build the project: `npm run build`
2. Deploy to Netlify
3. Set environment variables

### Backend (Vercel)
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables

## 🤝 Contributing

This is a college project, but suggestions and improvements are welcome!

## 📝 License

This project is created for educational purposes as part of a college curriculum.

## 👨‍🎓 Developer

**Student Name**  
Computer Science & Engineering  
College Name  
Academic Year: 2024-2025

---

**Note:** This project is developed as part of a college curriculum to demonstrate full-stack web development skills using modern technologies.
