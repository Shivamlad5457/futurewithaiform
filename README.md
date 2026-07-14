# Creator Collaboration Hub

Creator Collaboration Hub is a premium, responsive, and secure full-stack website designed to be placed in an Instagram bio or YouTube description. It allows brands, businesses, and creators to submit sponsorship, video creation, and marketing collaboration pitches directly. 

Administrators can securely log in, review submitted pitches, update request pipeline status, manage budgets, take custom internal campaign notes, and export CSV data records.

---

## 🎨 Premium UI/UX Aesthetic

*   **Glassmorphic Design**: Clean, translucent Apple-style glass cards, subtle shadows, and beautiful glowing accent colors.
*   **Dual Mode Capability**: Adaptive, beautiful dark mode (creator slate visual) and crisp light mode, toggled with a single header button.
*   **Motion Transitions**: Page route changes, checkmarks, sliders, and form errors use physics-based spring animations powered by `motion`.
*   **Touch Friendly**: Oversized clickable elements and layout density built mobile-first to ensure flawless performance on cellular Instagram frames.

---

## ⚙️ Advanced Features

1.  **Dual SQL Core Engine (Dynamically Adaptable)**:
    *   **Development / Preview**: Runs out-of-the-box using local **SQLite**, ensuring absolute zero-setup execution.
    *   **Production / MySQL**: Connects to any hosting cloud **MySQL** instances (such as Railway or Render) automatically if environment variables are supplied.
2.  **In-Memory Product Image Upload**: Custom drag-and-drop file selector that converts chosen files to standard Base64 string formats and persists them inside SQL `LONGTEXT` blocks securely without server-disk dependencies.
3.  **Automated Notifications**: Leverages `nodemailer` to trigger real HTML-formatted email alerts to the creator on new pitch submissions. Falls back to clear developer terminal logs in development.
4.  **Admin Workspace Tools**:
    *   Dashboard analytics counters.
    *   Search bars querying keywords and database records.
    *   Filters by collaboration status and high/medium/low priority levels.
    *   Dynamic CSV exports generated natively in-browser.
    *   Detailed request cards with notes updating and status toggling.

---

## 🛠️ Tech Stack & Directory Structure

*   **Frontend**: React (v19), Tailwind CSS, Lucide Icons, Motion (Framer Motion)
*   **Backend**: Node.js, Express.js, TypeScript compiler (`tsx`)
*   **Database Drivers**: `mysql2` (MySQL), `sqlite3` (SQLite fallback)
*   **Security & Hashing**: JWT (JSON Web Tokens), `bcryptjs`

### 📂 Folder Mapping (MVC Architecture)
```text
├── server.ts                  # Main Full-Stack Server Entry
├── schema.sql                 # Production MySQL database structure
├── api_documentation.md       # API endpoints catalog
├── package.json               # Scripts and dependencies
└── src/
    ├── types.ts               # Shared TypeScript definitions
    ├── api.ts                 # React frontend API query client
    ├── main.tsx               # Client bootstrap index
    ├── index.css              # Global styles, fonts and animations
    ├── App.tsx                # Main App Router and Theme provider
    ├── pages/                 # Full-Screen Page Components
    │   ├── Home.tsx           # Premium landing page
    │   ├── CollaborationForm.tsx # Responsive brief submission form
    │   ├── AdminLogin.tsx     # Apple-style security gateway
    │   └── AdminDashboard.tsx # Admin statistics and brief manager
    └── backend/               # Server-Side MVC Architecture
        ├── config/
        │   └── db.ts          # SQLite/MySQL adaptive database engine
        ├── controllers/
        │   ├── auth.ts        # Admin login and JWT sign controller
        │   └── collaboration.ts # Pitches CRUD and search compiler
        ├── middlewares/
        │   └── auth.ts        # Secure route JWT validation
        └── utils/
            └── mailer.ts      # HTML email SMTP transmitter
```

---

## 🏁 Development Setup

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Launch local development server**:
    ```bash
    npm run dev
    ```
    The full-stack application will immediately spin up and run on **http://localhost:3000**! The SQLite database will be initialized in `/data/collaboration_hub.sqlite` automatically.

3.  **Log in to Admin Panel**:
    *   Route: Click the lock icon in the navigation bar, or go to `http://localhost:3000/#admin`
    *   Default Credentials:
        *   **Username**: `admin`
        *   **Password**: `admin123`

---

## 🚀 Production Deployment Guide

### 1. Database Setup (MySQL)
Execute the queries in `schema.sql` on your MySQL instance (Railway, Render, AWS, or GCP Cloud SQL) to prepare the tables.

### 2. Environment Configuration
Provide the production environment variables (e.g. inside Railway / Render settings dashboard):
```env
PORT=3000
NODE_ENV=production
JWT_SECRET=your_production_secret_key_here

# MySQL Connection Details
DB_HOST=your-mysql-host.railway.app
DB_USER=root
DB_PASSWORD=your_mysql_database_password
DB_NAME=creator_collaboration_hub
DB_PORT=3306

# SMTP Details (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_TO_EMAIL=your_email@gmail.com
```

### 3. Compilation & Launch
To compile the TypeScript server and Vite frontend, and start the production application:
```bash
npm run build
npm start
```
Vite compiles your frontend files to `/dist/`. The backend server is compiled to `/dist/server.cjs` and automatically hosts your API and serving static web pages!
