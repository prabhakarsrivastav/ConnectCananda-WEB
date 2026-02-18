# Canadian Nexus - MongoDB Authentication Setup

This project now uses MongoDB for authentication instead of Supabase. The UI and styles remain completely unchanged.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB installed locally or a MongoDB Atlas account

## Setup Instructions

### 1. Install MongoDB

#### Option A: Local MongoDB
- Download and install MongoDB from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- Start MongoDB service:
  ```bash
  # Windows (run as administrator)
  net start MongoDB
  
  # Or use MongoDB Compass GUI
  ```

#### Option B: MongoDB Atlas (Cloud)
- Create a free account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get your connection string
- Update `backend/.env` with your MongoDB Atlas connection string

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies (already done):
   ```bash
   npm install
   ```

3. Configure environment variables in `backend/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/canadian-nexus
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

   **For MongoDB Atlas, use:**
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/canadian-nexus?retryWrites=true&w=majority
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   
   The server will run on `http://localhost:5000`

### 3. Frontend Setup

1. Navigate to the root directory:
   ```bash
   cd ..
   ```

2. The frontend `.env` file already has the API URL configured:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. Install frontend dependencies (if not already installed):
   ```bash
   npm install
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Running the Application

### Start Both Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

Then open your browser to the URL shown by Vite (usually `http://localhost:5173`)

## Features

### Authentication
- ✅ User signup with email, password, first name, last name, and phone
- ✅ User login with email and password
- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt
- ✅ Session persistence via localStorage
- ✅ Role-based access control (user/admin)

### First Admin Setup
The first user to sign up will NOT be automatically made an admin. After signing up or logging in, you'll see an option to "Become Admin" if no admin exists yet.

### API Endpoints

#### POST /api/auth/signup
Create a new user account
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

#### POST /api/auth/login
Login with existing credentials
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Get current user information (requires Bearer token)

#### GET /api/auth/check-admin
Check if an admin user exists in the system

#### POST /api/auth/become-admin
Make current user an admin (only works if no admin exists)

## Project Structure

```
├── backend/
│   ├── models/
│   │   └── User.js          # MongoDB user model
│   ├── routes/
│   │   └── auth.js          # Authentication routes
│   ├── server.js            # Express server setup
│   ├── package.json
│   └── .env
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx  # React auth context
│   ├── services/
│   │   └── authService.ts   # API client for auth
│   ├── pages/
│   │   ├── Auth.tsx         # Login/Signup UI
│   │   └── Dashboard.tsx    # User dashboard
│   └── components/
│       ├── Header.tsx       # Navigation with auth state
│       └── admin/
│           └── AdminLayout.tsx  # Admin panel layout
```

## Troubleshooting

### MongoDB Connection Issues
- **Error: "MongooseServerSelectionError"**
  - Ensure MongoDB is running: `net start MongoDB` (Windows)
  - Check if MongoDB is listening on port 27017
  - Verify the connection string in `backend/.env`

### CORS Issues
- The backend is configured to allow all origins with `cors()`
- If you still face CORS issues, you can specify the frontend URL:
  ```javascript
  app.use(cors({ origin: 'http://localhost:5173' }));
  ```

### Port Already in Use
- If port 5000 is busy, change it in `backend/.env`:
  ```env
  PORT=5001
  ```
  And update frontend `.env`:
  ```env
  VITE_API_URL=http://localhost:5001/api
  ```

## Security Notes

⚠️ **Important for Production:**
1. Change the `JWT_SECRET` in `backend/.env` to a strong, random string
2. Use environment variables for sensitive data
3. Enable MongoDB authentication
4. Use HTTPS for production
5. Implement rate limiting for auth endpoints
6. Add input validation and sanitization
7. Use secure password requirements

## UI/UX

All UI components and styles remain exactly the same as before. The only change is the backend authentication system from Supabase to MongoDB.

## Support

For issues or questions, please check:
1. MongoDB is running
2. Both backend and frontend servers are running
3. Environment variables are correctly set
4. Check console logs for errors

Happy coding! 🚀
