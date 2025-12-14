# CodeCraftHub – User Management Service

Node.js/Express service for user registration and login with MongoDB, JWT authentication, and tested service/controller logic.

## Features
- Registration with validation (required fields, minimum password length)
- Login with JWT tokens (1 hour expiry)
- Roles in the user model (`student`, `instructor`, `admin`)
- Centralized configuration for environment variables
- Global error handling and logging (Winston)
- Unit tests for service and controller layers (Jest)

## Project Structure

```text
src/
	app.js                # Entry point; starts server after DB connection
	config/
		env.js              # Loads/validates .env and exports config
		db.js               # Establishes MongoDB connection via Mongoose
		server.js           # Creates configured Express app instance
	controllers/
		userController.js   # HTTP handlers for /register and /login
	middleware/
		authMiddleware.js   # JWT auth middleware (Authorization: Bearer <token>)
	models/
		userModel.js        # Mongoose schema/model for users
	routes/
		userRoutes.js       # Routes for /api/users/register and /api/users/login
	services/
		userService.js      # Data access & business logic around users
	utils/
		errorHandler.js     # Global error handler for Express
		logger.js           # Winston logger (console + error.log)
tests/
	userController.test.js
	userService.test.js
```

## Prerequisites

- Node.js (recommended: ≥ 18)
- npm
- Running MongoDB instance (local or remote)

## Installation

```bash
cd "./CodeCraftHub"
npm install
```

## Configuration (.env)

Create a `.env` file in the project root:

```bash
MONGO_URI=mongodb://localhost:27017/codecrafthub
JWT_SECRET=averysecurelongsecret
PORT=5000
```

`src/config/env.js` ensures that `MONGO_URI` and `JWT_SECRET` are set – otherwise the app will fail fast on startup.

## Running the Application

Development mode with automatic restart (via `nodemon`, installed as a dev dependency):

```bash
npm run dev
```

Production-like (no file watching):

```bash
npm start
```

The API will be available at `http://localhost:5000` (or the value of `PORT`).

## API Endpoints

Base path: `http://localhost:<PORT>/api/users`

### POST /api/users/register

Registers a new user.

**Request body (JSON):**

```json
{
	"username": "alice",
	"email": "alice@example.com",
	"password": "secretpassword"
}
```

**Responses (examples):**
- `201 Created` – `{ "message": "User registered successfully." }`
- `400 Bad Request` – missing fields or password too short
- `409 Conflict` – username or email is already in use

### POST /api/users/login

Authenticates a user and returns a JWT.

**Request body (JSON):**

```json
{
	"email": "alice@example.com",
	"password": "secretpassword"
}
```

**Success response:**

```json
{
	"token": "<jwt-token>"
}
```


**Error responses (examples):**
- `400 Bad Request` – email or password is missing
- `401 Unauthorized` – invalid credentials

### Protected Routes (example)

For future protected endpoints you can use `authMiddleware`. The client has to send the header:

```http
Authorization: Bearer <jwt-token>
```

`authMiddleware` validates the token and attaches the decoded payload to `req.user`.

## Error Handling & Logging

- `errorHandler` catches all errors passed via `next(error)`.
- If `error.statusCode` and `error.isOperational` are set, that HTTP status and message are returned.
- Otherwise, the client receives a generic `500` response.
- All errors are logged via `logger` (Winston) and written e.g. to `error.log`.

## Tests

Jest is used for unit tests (currently without full HTTP integration tests):

```bash
npm test
```

Current tests:
- `tests/userService.test.js` – tests `userService` with a mocked `User` model
- `tests/userController.test.js` – tests `registerUser` and `loginUser` with mocked `userService`, `bcrypt`, `jsonwebtoken`

## Further Development

Possible next steps:
- Additional user routes: profile, password reset, role management
- Integration tests with `supertest` for full HTTP flows
- Restrict CORS configuration (only allow specific frontend origins)
- Deployment setup (e.g. Dockerfile, CI pipeline)
