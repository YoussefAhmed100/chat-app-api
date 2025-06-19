# Chat App API

A robust RESTful and real-time chat server built with **Node.js**, **Express**, **Socket.IO**, **Mongoose**, and **Cloudinary**.

---

## 🚀 Features

- Real-time messaging via Socket.IO
- User authentication (JWT)
- Admin/user roles with authorization
- CRUD for users, chats, and messages
- Media/file upload with Cloudinary
- User profiles, avatars, password management
- Search, online presence, typing/read indicators
- Docker-ready and scalable

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- Cloudinary account (for image/file uploads)
- Docker (optional)

### Installation

1. **Clone the repo & install dependencies:**
    ```bash
    git clone https://github.com/YoussefAhmed100/chat-app-api.git
    cd chat-app-api
    npm install
    ```

2. **Set up environment variables in `.env`:**
    ```
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/chat-app
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloudinary_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

3. **Start the server:**
    ```bash
    npm start
    ```

---

## 🗂️ Project Structure

```
/chat-app-api
├── app.js                        # Express app configuration
├── server.js                     # Server & Socket.IO bootstrap
├── mountRoutes.js                # Route mounting
├── .env                          # Environment variables
├── Dockerfile                    # Docker configuration
├── docker-compose.yml            # Docker Compose (multi-container deployment)
│
├── config/
│   ├── db.js                     # MongoDB connection setup
│   └── cloudinary.js             # Cloudinary configuration
│
├── services/                  # services for business logic
│   ├── auth.service.js
│   ├── user.services.js
│   └── message.services.js
│
├── docs/                         # API documentation (Swagger etc.)
│
├── middleWare/
│   ├── auth.middleWare.js        # JWT auth, role checks
│   ├── error.middleWare.js       # Error handling
│   ├── upload.middleWare.js      # File upload with multer/cloudinary
│   └── ...                       # Additional middleware
│
├── models/
│   ├── user.model.js
│   ├── message.model.js
│   └── chat.model.js
│
├── routes/
│   ├── user.route.js
│   ├── auth.route.js
│   └── message.route.js
│
├── services/
│   ├── auth.service.js
│   ├── user.service.js
│   └── message.service.js
│
├── sockets/
│   └── socket.js                 # Socket.IO event handlers
│
├── utils/
│   ├── validators/
│   │   ├── user.validator.js
│   │   ├── auth.validator.js
│   │   └── ...
│   └── ...                       # Helpers, utilities
│
└── package.json
```

---

## 📚 API Endpoints Overview

### Mounting Routes

All routes are mounted in `mountRoutes(app)` as follows:

```js
app.get("/", (req, res) => {
  res.send("Chat app server is running");
});
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/message", messageRoute);
```

---

### Auth Routes (`/api/v1/auth`)

| Method | Endpoint      | Description         | Access   |
|--------|---------------|---------------------|----------|
| POST   | `/signup`     | User registration   | Public   |
| POST   | `/login`      | User login          | Public   |
| POST   | `/logout`     | User logout         | Authenticated |

**Example**
```json
POST /api/v1/auth/signup
{
  "username": "john",
  "email": "john@example.com",
  "password": "YourPassword123!"
}
```

---

### User Routes (`/api/v1/users`)

All routes protected (require JWT). Admin access required for most.

| Method | Endpoint                    | Description              | Access      |
|--------|-----------------------------|--------------------------|-------------|
| GET    | `/`                         | List all users           | Admin only  |
| POST   | `/`                         | Create new user          | Admin only  |
| PUT    | `/update-userProfile/:id`   | Update user profile      | User/Admin  |
| GET    | `/:id`                      | Get user by ID           | User/Admin  |
| DELETE | `/:id`                      | Delete user              | User/Admin  |
| PUT    | `/changePassword/:id`       | Change user password     | User/Admin  |

**Example**
```json
PUT /api/v1/users/update-userProfile/USER_ID
{
  "username": "new_name",
  "avatar": "https://cloudinary.com/..."
}
```

---

### Message Routes (`/api/v1/message`)

All routes protected (require JWT).

| Method | Endpoint            | Description                            |
|--------|---------------------|----------------------------------------|
| GET    | `/users`            | List users for sidebar                 |
| GET    | `/:id`              | Get messages with user (by user/chat ID) |
| POST   | `/send/:id`         | Send message to user/chat              |

**Example**
```json
POST /api/v1/message/send/USER_OR_CHAT_ID
{
  "content": "Hello!",
  "attachments": ["https://cloudinary.com/..."]
}
```

---

## ☁️ Cloudinary File Uploads

- User avatars and message attachments are uploaded to Cloudinary.
- Use multipart/form-data; endpoints return the public Cloudinary URL.

---

## ⚡️ Real-Time Events (Socket.IO)

- `join` / `leave`: Join/leave chat rooms
- `message`: Send/receive messages
- `typing`: Typing indicator
- `read`: Mark message as read
- `presence`: User online/offline

---


