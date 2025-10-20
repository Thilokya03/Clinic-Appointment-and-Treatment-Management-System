# CATMS Setup Guide

## Prerequisites
- Node.js installed
- MySQL database running
- Environment variables configured in `backend/.env`

## Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Make sure your `.env` file has:
```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_secret_key
```

4. Start the backend server:
```bash
node server.js
```

Backend will run at: `http://localhost:3000`

## Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run at: `http://localhost:5173` (or the port shown in terminal)

## Testing Registration

1. Make sure both backend and frontend are running
2. Navigate to `http://localhost:5173/register`
3. Fill in the registration form with:
   - Full Name
   - Username
   - Address
   - Gender (select Male or Female)
   - Contact Number (10 digits)
   - NIC
   - Date of Birth
   - Emergency Contact Name
   - Emergency Contact Number (10 digits)
   - Email
   - Password (min 6 characters)
   - Confirm Password

4. Click "Register"
5. If successful, you'll see a success message and be redirected to login page
6. If there's an error, check:
   - Backend console for errors
   - Browser console (F12 → Console) for network errors
   - Database connection

## API Endpoint
The registration endpoint is: `POST /api/patient/signup`

## Changes Made
✅ Removed hardcoded `patient_id` (backend auto-generates it)
✅ Connected Register form to backend API
✅ Added proper error handling
✅ Validated all form fields before submission
✅ Auto-calculates age from Date of Birth
✅ Shows success/error messages via Snackbar
✅ Redirects to login page after successful registration
