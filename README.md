# MERN-Auth

A full-stack authentication project using the MERN stack (MongoDB, Express, React, Node.js).

## Features

- User registration and login
- JWT-based authentication
- Protected routes (backend & frontend)
- Password hashing with bcrypt
- User profile management

## Technologies

- **Frontend:** React, Axios, React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcrypt

## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/mern-auth.git
    cd mern-auth
    ```

2. Install backend dependencies:

    ```bash
    cd server
    npm install
    ```

3. Install frontend dependencies:

    ```bash
    cd ../client
    npm install
    ```

4. Set up environment variables in both `backend/.env` and `frontend/.env`.

### Running the App

- Start the backend server:

    ```bash
    cd server
    npm run dev
    ```

- Start the frontend app:

    ```bash
    cd ../client
    npm start
    ```

## Folder Structure

```text
mern-auth/
  server/
     models/
     routes/
     controllers/
     ...
  client/
     src/
     components/
     pages/
     ...
```

## License

This project is licensed under the MIT License.
