# 🚀 Quick Start Guide - MongoDB Authentication

## ⚡ Quick Setup (3 Steps)

### Step 1: Install MongoDB
**Option A - Local (Recommended for development):**
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will start automatically

**Option B - Cloud (MongoDB Atlas):**
1. Sign up at https://cloud.mongodb.com
2. Create a free cluster
3. Get connection string and update `backend/.env`

### Step 2: Start the Backend
Open PowerShell/CMD and run:
```bash
cd backend
npm run dev
```
You should see: `Server is running on port 5000` and `MongoDB connected successfully`

### Step 3: Start the Frontend
Open another PowerShell/CMD window and run:
```bash
npm run dev
```

## 🎯 Using the Application

### First Time Setup
1. Open browser to http://localhost:5173
2. Click "Login / Sign Up" in header
3. Create an account (first account can become admin)
4. After login, click "Become Admin" button if you want admin access

### Regular Login
1. Go to http://localhost:5173/auth
2. Enter your email and password
3. Click "Login"

## 🔧 Troubleshooting

**Backend won't start?**
- Make sure MongoDB is running
- Check if port 5000 is available
- Verify `backend/.env` file exists

**Frontend won't connect?**
- Make sure backend is running on port 5000
- Check browser console for errors
- Verify `.env` has `VITE_API_URL=http://localhost:5000/api`

**Can't connect to MongoDB?**
```bash
# Check if MongoDB is running (Windows)
net start MongoDB

# Or check Task Manager for "mongod" process
```

## 📝 What Changed?

- ✅ Replaced Supabase authentication with MongoDB
- ✅ All UI and styles remain exactly the same
- ✅ Added JWT token-based authentication
- ✅ User data stored in MongoDB
- ✅ Secure password hashing with bcrypt

## 🎨 No UI Changes!

All pages look and work exactly the same:
- Login/Signup page
- Dashboard
- Admin panel
- Header navigation
- All other pages

Only the authentication backend changed from Supabase to MongoDB!

## 📞 Need Help?

1. Check MongoDB is running: Open MongoDB Compass
2. Check backend logs in the terminal
3. Check browser console (F12) for errors
4. Read full documentation: MONGODB_AUTH_SETUP.md

---

**Everything else in the project (UI, routing, components, styles) remains unchanged!**
