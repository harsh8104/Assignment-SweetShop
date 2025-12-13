# Sweet Shop Management System - Setup Guide

## Complete Installation Guide

Follow these steps to set up and run the Sweet Shop Management System locally.

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/downloads)

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd Assignment
```

### Step 2: Backend Setup

#### 2.1 Navigate to backend directory

```bash
cd backend
```

#### 2.2 Install dependencies

```bash
npm install
```

#### 2.3 Configure environment variables

Create a `.env` file in the `backend` directory with the following content:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sweetshop
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Important**: Change the `JWT_SECRET` to a random secure string in production!

#### 2.4 Start MongoDB

**Windows:**

```bash
# Start MongoDB service
net start MongoDB
```

**Mac/Linux:**

```bash
# Start MongoDB service
sudo systemctl start mongod
# OR
mongod
```

#### 2.5 Run the backend server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The backend API will be available at `http://localhost:5000`

### Step 3: Frontend Setup

Open a **new terminal window** and navigate to the frontend directory.

#### 3.1 Navigate to frontend directory

```bash
cd frontend
```

#### 3.2 Install dependencies

```bash
npm install
```

#### 3.3 Start the React development server

```bash
npm start
```

The frontend will automatically open at `http://localhost:3000`

### Step 4: Create Admin User (Optional)

To access the Admin Panel, you need an admin user. You can create one by:

1. Register a new user through the UI
2. Use MongoDB Compass or mongo shell to update the user:

```javascript
// Connect to MongoDB
use sweetshop

// Update user to admin
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { isAdmin: true } }
)
```

### Step 5: Testing

#### Backend Tests

```bash
cd backend
npm test

# With coverage
npm run test:coverage
```

#### Frontend Tests

```bash
cd frontend
npm test
```

### Quick Start Script

For convenience, you can run both backend and frontend simultaneously:

**Windows (PowerShell):**

```powershell
# Run in one terminal
cd backend; npm run dev
```

Then in another terminal:

```powershell
cd frontend; npm start
```

**Mac/Linux:**

```bash
# Install concurrently globally (one time)
npm install -g concurrently

# From root directory
concurrently "cd backend && npm run dev" "cd frontend && npm start"
```

### Troubleshooting

#### MongoDB Connection Error

If you see "MongoServerError: connect ECONNREFUSED":

- Make sure MongoDB is running
- Check if MongoDB is listening on port 27017
- Verify MONGODB_URI in `.env` file

#### Port Already in Use

If port 5000 or 3000 is already in use:

- Change PORT in backend `.env` file
- React will automatically prompt to use a different port

#### Module Not Found Error

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Endpoints

Once running, you can test the API:

- **GET** `/api/sweets` - Get all sweets (requires authentication)
- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user
- **POST** `/api/sweets` - Add sweet (admin only)
- **PUT** `/api/sweets/:id` - Update sweet (admin only)
- **DELETE** `/api/sweets/:id` - Delete sweet (admin only)
- **POST** `/api/sweets/:id/purchase` - Purchase sweet
- **POST** `/api/sweets/:id/restock` - Restock sweet (admin only)

### Default Login Credentials

After registering, you can use your credentials. For admin access, you need to manually set `isAdmin: true` in the database.

### Support

If you encounter any issues, please check:

1. All dependencies are installed
2. MongoDB is running
3. Environment variables are correctly set
4. Ports 3000 and 5000 are available

---

**Enjoy managing your Sweet Shop!** 🍬
