# 🏥 Hospital Token Booking Management System (TVL SmartCare)

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-5.2.1-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%209-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel Deployment](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com/)

An intelligent, full-stack Hospital Token Booking & Outpatient Department (OPD) Queue Management System designed specifically for healthcare facilities across **Tirunelveli District, Tamil Nadu**. 

The platform bridges patients, doctors, hospital administrators, and emergency casualty teams into a unified real-time portal featuring smart symptom triage, live token tracking, downloadable passes with QR verification, emergency code red alerts, and bilingual voice broadcasts in **Tamil (தமிழ்)** and **English**.

---

## 🌟 Key Features

### 1. Patient Portal & Booking Experience
- **Symptom-Based Hospital Recommendations:** Intelligent triage matching symptoms to departments (Cardiology, Dermatology, Orthopedics, Ophthalmology, etc.).
- **5-Step Booking Wizard:** Problem Selection → Date & Department → Hospital & Distance → Doctor & Chamber → Digital Token Generation.
- **Government & Private Hospital Directory:** Full coverage of Tirunelveli Medical College Hospital (TVMCH), Shifa Hospital, Aravind Eye Hospital, Kauvery Hospital, Porunai Hospital, and more.
- **Digital Pass & QR Verification:** Real-time token number, room assignment, estimated wait time, printable receipt, and QR scanner pass.
- **Communication Alerts:** Simulated and API-integrated SMS passes, WhatsApp sharing, and email notifications.
- **Family Dependents Management:** Book and track appointments for family members.

### 2. Live Queue & Emergency Triage
- **Live Sequence Board:** Real-time OPD counter ticker and wait-time progress bar.
- **Code Red Emergency Casualty:** Instant priority allocation (Token #1), casualty routing, and 108 ambulance dispatch.
- **Voice Broadcasts:** Automated bilingual audio announcements in Tamil & English (`hospitalAudio.js`).
- **Waiting Hall TV / Kiosk Display:** Full-screen dashboard (`/opd-display`, `/tv-display`) for hospital waiting hall screens.

### 3. Role-Based Administration & Staff Consoles
- **District Admin Dashboard:** District-wide token registry, hospital bed occupancy, OPD counters, and real-time statistics.
- **OPD Staff / Nurse Console:** Call next token, toggle doctor availability, and mark patient attendance.
- **Secure Authentication:** Multi-role access control for Patients, Hospital Staff, and District Administrators with JWT verification.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, React Router v6, Tailwind CSS, Lucide Icons, Framer Motion, Leaflet Maps, React Hot Toast, QRCode.react |
| **Backend** | Node.js, Express 5, CORS, Dotenv, REST API architecture |
| **Database & Models** | MongoDB / Mongoose 9 (Hospitals, Doctors, Tokens, Users) with seamless fallback engine |
| **Speech & Audio** | Web Speech API & HTML5 Audio for Tamil and English emergency & queue broadcasts |
| **Deployment** | GitHub Repository, Vercel Serverless Functions (`/api`), Continuous Deployment (CI/CD) |

---

## 📂 Project Structure

```
├── api/                       # Vercel Serverless Function entrypoint
│   └── index.js               # Serverless Express adapter
├── dist/                      # Production build output
├── public/                    # Static assets & icons
├── server/                    # Backend server & persistence
│   ├── models/                # Mongoose Models (Doctor, Hospital, Token, User)
│   ├── db.json                # Seed database storage
│   ├── server.js              # Express REST API routes & MongoDB connection
│   └── .env.example           # Backend environment template
├── src/
│   ├── components/            # Reusable UI, Queue, Booking, and Admin components
│   ├── context/               # React Contexts (Auth, Booking, Hospital, Queue, etc.)
│   ├── pages/                 # Full application pages & admin sub-pages
│   ├── services/              # API Client (Axios) configured for dynamic base URLs
│   ├── utils/                 # Audio announcements, constants, helper functions
│   ├── App.jsx                # Route registry & role guards
│   └── main.jsx               # App entrypoint
├── .env.example               # Frontend environment template
├── .gitignore                 # Secrets & dependency exclusions
├── package.json               # Dependencies and build scripts
├── vercel.json                # Vercel SPA routing and API rewrite rules
└── vite.config.js             # Vite configuration with /api proxy
```

---

## 🔑 Demo Access Credentials

| Role | Portal URL | Credentials |
|---|---|---|
| **Patient** | `/login` | `karthik.raja@tvlcare.in` / `password123` *(or any 10-digit mobile number with OTP `123456`)* |
| **District Admin** | `/admin/login` *(Select Admin)* | `admin@tvlhealth.gov.in` / `admin123` |
| **Hospital Staff / Nurse** | `/admin/login` *(Select Staff)* | `opd.tvmch@tvlcare.in` / `staff123` |

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js (v18 or higher recommended, tested on Node v24)
- npm (v9 or higher)

### 1. Clone & Install
```bash
git clone https://github.com/24104090-droid/Hospital-Token-Booking-Management-System.git
cd Hospital-Token-Booking-Management-System
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Development Servers
- **Run Frontend Dev Server:**
  ```bash
  npm run dev
  ```
  Accessible at `http://localhost:3000` (auto-proxies `/api` requests to backend).

- **Run Backend Express Server:**
  ```bash
  npm run server
  ```
  Accessible at `http://localhost:5000` with health check at `http://localhost:5000/api/health`.

### 4. Build for Production
```bash
npm run build
```
Generates production-optimized static bundle in the `dist/` directory.

---

## 🚀 Deployment to Vercel

### Step 1: Push Repository to GitHub
Ensure all code is committed and pushed to the `main` branch on GitHub:
```bash
git add .
git commit -m "Configure production deployment and Vercel serverless integration"
git push -u origin main
```

### Step 2: Import into Vercel
1. Log in to [Vercel](https://vercel.com/) with your GitHub account (`24104090-droid`).
2. Click **"Add New..."** → **"Project"**.
3. Select **`Hospital-Token-Booking-Management-System`** from the repository list.
4. Vercel automatically detects the **Vite** framework preset, Root Directory `./`, Build Command `npm run build`, and Output Directory `dist`.
5. Under **Environment Variables**, optionally set:
   - `MONGODB_URI`: Your MongoDB Atlas connection string (e.g. `mongodb+srv://<user>:<pwd>@cluster0.abcde.mongodb.net/mediqueue`).
   - `JWT_SECRET`: Your production secret key.
   - `VITE_GOOGLE_CLIENT_ID`: Google OAuth Web Client ID (if using Google Login).
6. Click **Deploy**.

### Step 3: Automatic Continuous Deployment (CI/CD)
Whenever new changes, bug fixes, or new features are committed and pushed to the `main` branch on GitHub:
- Vercel automatically detects the push.
- It triggers a new production build.
- It updates the live website URL automatically with zero downtime.

---

## 🔒 Security & Privacy Notice
- Never commit `.env` files, production MongoDB connection credentials, JWT secrets, or patient data.
- All secrets are excluded via `.gitignore` and must only be configured in hosting environment variable settings.

---

## 📄 License
This project is open-source and developed for the healthcare management ecosystem of Tirunelveli District, Tamil Nadu.
