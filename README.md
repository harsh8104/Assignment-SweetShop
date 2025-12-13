# Sweet Shop Management System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for managing a sweet shop with user authentication, inventory management, and purchase functionality.

## Project Overview

This project is a comprehensive Sweet Shop Management System built following Test-Driven Development (TDD) principles. It features a RESTful API backend with MongoDB database and a modern React frontend.

### Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Sweet Management**: CRUD operations for managing sweets inventory
- **Search & Filter**: Advanced search by name, category, and price range
- **Purchase System**: Buy sweets with real-time inventory updates
- **Admin Controls**: Restricted endpoints for adding, updating, and restocking sweets
- **Responsive UI**: Modern, mobile-friendly interface

## Tech Stack

### Backend
- **Node.js** with **Express.js** - RESTful API server
- **MongoDB** with **Mongoose** - Database and ODM
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **Jest** & **Supertest** - Testing framework

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management
- **CSS3** - Styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

#### 1. Clone the repository

```bash
git clone <repository-url>
cd Assignment
```

#### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sweetshop
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

Start MongoDB service and run the backend:

```bash
npm run dev
```

#### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The application will be available at `http://localhost:3000`

### Running Tests

#### Backend Tests

```bash
cd backend
npm test
npm run test:coverage
```

#### Frontend Tests

```bash
cd frontend
npm test
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Sweets Endpoints (Protected)

- `POST /api/sweets` - Add a new sweet (Admin)
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/search` - Search sweets
- `PUT /api/sweets/:id` - Update sweet (Admin)
- `DELETE /api/sweets/:id` - Delete sweet (Admin)

### Inventory Endpoints (Protected)

- `POST /api/sweets/:id/purchase` - Purchase a sweet
- `POST /api/sweets/:id/restock` - Restock a sweet (Admin)

## Development Approach

This project was developed following **Test-Driven Development (TDD)** methodology:

1. **Red** - Write failing tests first
2. **Green** - Implement minimum code to pass tests
3. **Refactor** - Improve code while keeping tests green

All commits follow the pattern of writing tests before implementation, visible in the Git history.

## My AI Usage

### AI Tools Used

I used **GitHub Copilot** throughout this project to accelerate development while maintaining code quality and learning.

### How AI Was Used

1. **Boilerplate Generation**: Used Copilot to generate initial Express server setup, route handlers, and React component structures
2. **Test Writing**: AI assisted in writing comprehensive test cases for API endpoints and ensuring good coverage
3. **Code Completion**: Utilized intelligent autocomplete for repetitive patterns like middleware functions and error handling
4. **Documentation**: AI helped generate JSDoc comments and API documentation
5. **Debugging**: Consulted AI for troubleshooting MongoDB connection issues and JWT authentication flow

### Reflection on AI Impact

Using AI tools significantly improved my development workflow:

- **Speed**: Reduced time spent on boilerplate code by ~40%
- **Learning**: AI suggestions helped me discover better patterns and practices
- **Testing**: Made writing comprehensive tests faster and more thorough
- **Focus**: Allowed me to focus on business logic rather than syntax

However, I critically reviewed all AI-generated code, made modifications where needed, and ensured I understood every line before committing. AI was a powerful assistant, not a replacement for understanding the fundamentals.

## Project Structure

```
Assignment/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── tests/
│   │   └── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
└── README.md
```

## Screenshots

*(Screenshots will be added after implementation)*

## License

This project is for educational purposes.

## Author

Developed as part of a TDD coding kata assessment.

---

*Built with ❤️ using MERN Stack and Test-Driven Development*
