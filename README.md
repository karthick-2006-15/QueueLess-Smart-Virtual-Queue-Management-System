# QueueLess — Smart Virtual Queue Management System

QueueLess is a modern, full-stack virtual queue management system designed to eliminate physical waiting lines in universities and service centers. Users can join a virtual queue, track their live position, and receive real-time notifications when their turn approaches.

## 🚀 Features

- **Virtual Queue Joining**: Users can join service queues from anywhere via their mobile or desktop browser.
- **Real-Time Tracking**: Live updates of queue position and estimated wait times using Socket.IO.
- **Role-Based Access Control**:
  - **Students/Users**: Join queues, view history, and receive notifications.
  - **Staff/Operators**: Call tokens, mark completions, or skip no-shows through a dedicated queue management dashboard.
  - **Admins**: Manage active services, monitor real-time statistics, and configure average wait times.
- **Secure Authentication**: JWT-based authentication stored in HTTP-only cookies with bcrypt password hashing.
- **Responsive UI/UX**: Premium "glassmorphism" aesthetic built with Vanilla HTML/CSS.

## 💻 Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Variables, Flexbox, Grid), Vanilla JavaScript (ES6+).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB with Mongoose ODM.
- **Real-Time**: Socket.IO for event-driven live updates.
- **Security**: JSON Web Tokens (JWT), bcryptjs, Helmet, CORS.

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/karthick-2006-15/QueueLess-Smart-Virtual-Queue-Management-System.git
   cd QueueLess-Smart-Virtual-Queue-Management-System
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following values:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/queueless
   JWT_SECRET=super_secret_jwt_key_please_change_in_production
   JWT_EXPIRES_IN=30d
   JWT_COOKIE_EXPIRES_IN=30
   ```

4. **Run the Application:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Server API: `http://localhost:5000`
   - Frontend UI: Open `client/index.html` in your browser.

## 📂 Project Structure

```text
QueueLess/
├── client/                 # Vanilla HTML/CSS/JS Frontend
│   ├── css/                # Stylesheets (style.css, dashboard.css)
│   ├── js/                 # API connection and logic
│   └── *.html              # UI Views
├── server/                 # Node/Express Backend
│   ├── config/             # DB configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth & Error handling
│   ├── models/             # Mongoose Schemas (User, Service, Queue)
│   └── routes/             # API routing
├── .env                    # Environment secrets
├── package.json
└── server.js               # Entry point
```

## 📝 API Endpoints (Current Implementation)

- **Auth**
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Authenticate user
  - `POST /api/auth/logout` - Clear auth cookies
  - `GET /api/auth/me` - Get current user profile
- **Services**
  - `GET /api/services` - List active services
  - `GET /api/services/:id` - Get specific service
  - `POST /api/services` - Create service (Admin)
  - `PUT /api/services/:id` - Edit service (Admin)
  - `DELETE /api/services/:id` - Delete service (Admin)

---
*Developed for a B.Tech/CSE Full-Stack Web Development Project.*
