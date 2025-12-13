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

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

### Quick Installation

**See [SETUP.md](SETUP.md) for detailed installation instructions.**

#### 1. Clone and Install Backend

```bash
# Clone repository
git clone <repository-url>
cd Assignment

# Backend setup
cd backend
npm install

# Create .env file (copy from .env.example)
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start backend (requires MongoDB running)
npm run dev
```

#### 2. Install and Run Frontend

```bash
# In a new terminal, from root directory
cd frontend
npm install
npm start
```

**The application will open at `http://localhost:3000`**

**Backend API runs at `http://localhost:5000`**

### Running Tests

#### Backend Tests (Jest + Supertest)

```bash
cd backend

# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Watch mode for TDD
npm run test:watch
```

**Test Coverage**: Backend includes comprehensive test suites for:

- User authentication (registration, login, JWT validation)
- Sweet CRUD operations
- Search and filter functionality
- Purchase and restock operations
- Authorization (user vs admin)

#### Frontend Tests

```bash
cd frontend

# Run React tests
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

## My AI Usage

### AI Tools Used

I used **GitHub Copilot** as my primary AI development assistant throughout this project.

### How I Used AI

#### 1. **Architecture and Planning**

- Used Copilot to brainstorm project structure and folder organization
- Got suggestions for best practices in MERN stack development
- Helped identify which npm packages to use for specific features

#### 2. **Backend Development**

- **Boilerplate Generation**: Copilot generated initial Express server setup, middleware configuration, and route structure
- **Model Design**: AI suggested Mongoose schema patterns and validation rules
- **Authentication**: Helped implement JWT token generation and bcrypt password hashing
- **Error Handling**: Generated consistent error handling patterns across controllers

#### 3. **Test-Driven Development**

- **Test Cases**: Copilot suggested comprehensive test scenarios I might have missed
- **Test Setup**: Generated beforeEach/afterEach hooks and database cleanup code
- **Assertions**: Helped write detailed assertions for API responses
- **Edge Cases**: Identified edge cases like duplicate users, insufficient stock, invalid tokens

#### 4. **Frontend Development**

- **React Components**: Generated component boilerplate with proper prop types
- **State Management**: Suggested React Context patterns for auth state
- **API Integration**: Created axios service layer with interceptors
- **CSS Styling**: Generated responsive CSS with modern gradients and animations

#### 5. **Documentation**

- **Comments**: Generated JSDoc comments for functions and components
- **README**: Helped structure comprehensive documentation
- **Setup Instructions**: Created detailed installation guides

### Specific Examples

**Example 1 - Test Case Generation:**
I wrote the test description, and Copilot suggested the implementation:

```javascript
// I typed: it('should fail with insufficient stock'
// Copilot generated the full test with proper assertions
```

**Example 2 - Error Handling:**
After I wrote one try-catch block, Copilot suggested consistent patterns for all other controllers, which I reviewed and adapted.

**Example 3 - CSS Animations:**
I specified "loading spinner", and Copilot generated the full CSS with keyframe animations.

### What I Did Manually

While AI was helpful, I took full responsibility for:

- **Business Logic**: All core functionality decisions were mine
- **Security**: Verified JWT implementation and password hashing
- **Testing Strategy**: Decided which tests to write and coverage goals
- **Code Review**: Reviewed every AI suggestion critically
- **Debugging**: Fixed issues that AI didn't catch
- **Git Commits**: Wrote all commit messages myself with proper descriptions

### Reflection on AI Impact

#### Positive Impacts:

- **Productivity**: Reduced development time by approximately 35-40%
- **Code Quality**: AI suggestions often followed best practices I was learning
- **Learning**: Discovered new patterns and techniques through AI suggestions
- **Consistency**: Maintained consistent code style across the project
- **Test Coverage**: AI helped me think of edge cases I might have missed

#### Challenges:

- **Over-reliance Risk**: Had to be careful not to accept code without understanding it
- **Context Limitations**: Sometimes AI suggested outdated or incorrect approaches
- **Debugging AI Code**: When AI-generated code had bugs, it took time to understand and fix
- **Generic Solutions**: Had to customize AI suggestions to fit specific requirements

### Key Takeaway

AI tools like GitHub Copilot are **powerful productivity multipliers** when used correctly. They excel at:

- Generating boilerplate and repetitive code
- Suggesting common patterns and best practices
- Accelerating test writing
- Creating documentation

However, they **cannot replace**:

- Understanding of fundamentals
- Critical thinking and code review
- Architecture decisions
- Domain knowledge
- Debugging complex issues

**My Approach**: I used AI as a **pair programmer** - it made suggestions, I reviewed them critically, adapted them to my needs, and took full ownership of the final code.

### Transparency

Every commit where AI significantly contributed has been co-authored with:

```
Co-authored-by: GitHub Copilot <copilot@github.com>
```

This represents approximately 60-70% of commits, where AI helped with:

- Initial code generation
- Test scaffolding
- CSS styling
- Documentation

The remaining 30-40% of work was purely manual debugging, refinement, and customization.

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

### Login Page

![Login Page](screenshots/login.png)
_User-friendly login interface with validation_

### Registration Page

![Registration](screenshots/register.png)
_New user registration with password confirmation_

### Home Dashboard

![Home Dashboard](screenshots/home.png)
_Main dashboard showing all available sweets with search and filter_

### Search & Filter

![Search](screenshots/search.png)
_Advanced search by name, category, and price range_

### Purchase Interface

![Purchase](screenshots/purchase.png)
_Sweet card with quantity selector and purchase button_

### Admin Panel

![Admin Panel](screenshots/admin.png)
_Admin dashboard for inventory management_

### Add/Edit Sweet

![Add Sweet](screenshots/add-sweet.png)
_Modal form for adding or updating sweets_

**Note**: Screenshots will be added after running the application locally. To generate screenshots:

1. Run the application
2. Create a `screenshots` folder in the root directory
3. Take screenshots of each page
4. Save them with the names shown above

## License

This project is for educational purposes.

## Author

Developed as part of a TDD coding kata assessment.

---

_Built with ❤️ using MERN Stack and Test-Driven Development_
