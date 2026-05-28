# Premium Portfolio & AI Resume Builder

A premium, modern, responsive developer portfolio coupled with a smart resume tailoring tool. Styled using a dark SaaS design system (inspired by Linear and Stripe) with neon gradients, smooth Framer Motion transitions, and glassmorphism.

## Features

- **Personal Branding Pages**: Hero, About (with stats metrics), interactive Skills dashboard, Projects showcase (with tech filtering), Work experience timeline, and Services offerings.
- **AI Resume Builder**: Paste job descriptions or criteria. The system extracts industry technical keywords, ranks and custom-sorts experience and projects by relevance, calculates an alignment score, and renders a printable A4 layout with ATS formatting.
- **Admin Dashboard Console**: Add/Delete catalog projects, read client inquiries inbox, and view visitor analytics tracking charts (powered by Recharts).
- **Relational MySQL Database**: Schema structured to log visits, contact forms, skills, projects, and custom tailored resumes.
- **Offline Fallback System**: If a MySQL server is not detected, the app automatically transitions to a fully functional client-side mockup in-memory store so it never crashes!

---

## 🛠️ Installation & Setup

### ⚡ Quick Start (Windows One-Click Launch)
If you are on Windows, you can start both the backend API and the frontend UI servers with a single click:
1. Double-click the **`start-local.bat`** file in the root directory.
2. The script will automatically configure your local path, launch the backend on port `5000`, launch the frontend on port `3000`, and open your browser to `http://localhost:3000` after a 5-second initialization delay.

---

### Manual Launch Setup

### 1. Database Setup
Ensure you have MySQL running. Create the database and seed it with pre-configured developer profile data:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### 2. Configure Environment Variables
Inside the `backend/` directory, copy `.env.example` to `.env` and fill in your custom variables (database password, SMTP server for emails):
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=premium_portfolio

# Email OTP & contact notification settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM=your_email@gmail.com
```

### 3. Launch Backend Server
Install node modules and start the Node/Express backend. You can use standard npm scripts or run it in background mode with PM2 (highly recommended for production VPS hosting):
```bash
cd backend
npm install

# Run locally in development mode:
npm run dev

# Or start in production with PM2:
npm install -g pm2
pm2 start ecosystem.config.js
```

### 4. Launch Frontend App
Install dependencies and run the Vite React app:
```bash
cd ../frontend
npm install

# Start local hot-reload dev server:
npm run dev

# Create static production build (saved in /dist or ready to copy to cPanel public_html):
npm run build
```

---

## 🌐 AntiGravity / VPS Hosting Deployment Guide

### Shared/cPanel Node.js Hosting:
1. Copy the frontend compilation assets inside `frontend/dist/*` directly into your website root directory (usually `public_html/`).
2. Zip the `backend/` folder and upload it to a directory above `public_html` (e.g., `/home/username/backend`).
3. Set up a Node.js Application inside your cPanel dashboard:
   - **Application Root**: `backend`
   - **Application URL**: `yourdomain.com/api` (or matching proxy config)
   - **Application Startup File**: `src/index.js`
4. Define environment variables in cPanel Node.js interface matching your `.env` layout.
5. Create a MySQL database inside cPanel and import `database/schema.sql` and `database/seed.sql`. Update the DB credentials in the Node app.

### VPS Deployment:
1. Clone this repository into the VPS home directory.
2. Build the static frontend via Vite and configure Nginx to serve `frontend/dist/` as the static web root.
3. Configure Nginx proxy rules to pass requests under `/api` to `http://localhost:5000`.
4. Run the Express backend on port `5000` via PM2 to ensure continuous uptime and automatic restart on crash:
   ```bash
   pm2 start backend/ecosystem.config.js
   pm2 save
   pm2 startup
   ```
