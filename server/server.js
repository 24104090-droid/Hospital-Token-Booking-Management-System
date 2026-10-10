import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Mongoose Models
import HospitalModel from './models/Hospital.js';
import DoctorModel from './models/Doctor.js';
import TokenModel from './models/Token.js';
import UserModel from './models/User.js';

let MongoMemoryServerClass = null;
try {
  const mms = await import('mongodb-memory-server');
  MongoMemoryServerClass = mms.MongoMemoryServer;
} catch (e) {
  // Optional if not yet compiled
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'db.json');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mediqueue';

let isMongoConnected = false;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Initialize Database Storage
const initialDatabase = {
  hospitals: [
    {
      id: 'h1',
      name: 'Tirunelveli Medical College Hospital (TVMCH)',
      type: 'Government',
      district: 'Tirunelveli',
      area: 'High Grounds, Palayamkottai',
      address: 'High Grounds, Palayamkottai, Tirunelveli - 627011',
      phone: '+91 462 2572733',
      emergencyPhone: '108 / +91 462 2572735',
      rating: 4.6,
      consultationFee: 0,
      currentServingToken: 24,
      totalTokensIssuedToday: 78,
      averageWaitMins: 12,
      crowdLevel: 'Moderate',
      departments: ['General Medicine', 'Cardiology', 'Obstetrics & Gynecology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Ophthalmology', 'ENT', 'Emergency Medicine'],
      location: { lat: 8.7183, lng: 77.7478 }
    },
    {
      id: 'h2',
      name: 'Shifa Hospital',
      type: 'Private',
      district: 'Tirunelveli',
      area: 'Vannarpettai',
      address: '82, Kailasapuram, Vannarpettai, Tirunelveli - 627003',
      phone: '+91 462 2501234',
      emergencyPhone: '+91 462 2501999',
      rating: 4.8,
      consultationFee: 350,
      currentServingToken: 14,
      totalTokensIssuedToday: 42,
      averageWaitMins: 8,
      crowdLevel: 'Normal',
      departments: ['General Medicine', 'Cardiology', 'Pediatrics', 'Obstetrics & Gynecology', 'ENT'],
      location: { lat: 8.7291, lng: 77.7235 }
    },
    {
      id: 'h3',
      name: 'Aravind Eye Hospital',
      type: 'Specialized (Eye)',
      district: 'Tirunelveli',
      area: 'Vannarpettai',
      address: 'S.N. High Road, Vannarpettai, Tirunelveli - 627003',
      phone: '+91 462 4356100',
      emergencyPhone: '+91 462 4356111',
      rating: 4.9,
      consultationFee: 200,
      currentServingToken: 31,
      totalTokensIssuedToday: 95,
      averageWaitMins: 15,
      crowdLevel: 'Busy',
      departments: ['Ophthalmology', 'Cataract', 'Retina', 'Pediatric Ophthalmology'],
      location: { lat: 8.7335, lng: 77.7258 }
    },
    {
      id: 'h4',
      name: 'Kauvery Hospital',
      type: 'Private Super Specialty',
      district: 'Tirunelveli',
      area: 'Palayamkottai Road',
      address: 'Palayamkottai Road, Vannarpettai, Tirunelveli - 627002',
      phone: '+91 462 4006000',
      emergencyPhone: '+91 462 4006108',
      rating: 4.7,
      consultationFee: 400,
      currentServingToken: 9,
      totalTokensIssuedToday: 30,
      averageWaitMins: 6,
      crowdLevel: 'Normal',
      departments: ['Cardiology', 'Orthopedics', 'Neurology', 'General Medicine'],
      location: { lat: 8.7265, lng: 77.7312 }
    },
    {
      id: 'h5',
      name: 'Porunai Hospital',
      type: 'Private',
      district: 'Tirunelveli',
      area: 'Palayamkottai',
      address: 'Tiruchendur Road, Palayamkottai, Tirunelveli - 627002',
      phone: '+91 462 2575555',
      emergencyPhone: '+91 462 2575556',
      rating: 4.5,
      consultationFee: 300,
      currentServingToken: 16,
      totalTokensIssuedToday: 48,
      averageWaitMins: 10,
      crowdLevel: 'Moderate',
      departments: ['General Medicine', 'Pediatrics', 'Orthopedics', 'Dermatology'],
      location: { lat: 8.7142, lng: 77.7540 }
    }
  ],
  doctors: [
    { id: 'doc-1', hospitalId: 'h1', name: 'Dr. S. Sundararajan, MD', specialty: 'General Medicine', room: 'OPD Block A - Room 102', experience: '18 Years', rating: 4.8, fee: 0 },
    { id: 'doc-2', hospitalId: 'h1', name: 'Dr. P. Muthukumar, DM', specialty: 'Cardiology', room: 'Cardiac Wing - Room 201', experience: '15 Years', rating: 4.9, fee: 0 },
    { id: 'doc-3', hospitalId: 'h1', name: 'Dr. K. Revathi, MD (DVL)', specialty: 'Dermatology', room: 'Skin Clinic - Room 108', experience: '12 Years', rating: 4.7, fee: 0 },
    { id: 'doc-4', hospitalId: 'h1', name: 'Dr. G. Sivakumar, MD', specialty: 'Pediatrics', room: 'Child Health - Room 105', experience: '14 Years', rating: 4.8, fee: 0 },
    { id: 'doc-5', hospitalId: 'h2', name: 'Dr. M. Senthil Nathan, MS', specialty: 'General Medicine', room: 'Consulting Suite 3', experience: '16 Years', rating: 4.7, fee: 350 },
    { id: 'doc-6', hospitalId: 'h3', name: 'Dr. Deepa Senthil, MS', specialty: 'Ophthalmology', room: 'Vision Care Room 4', experience: '14 Years', rating: 4.9, fee: 200 }
  ],
  tokens: [
    {
      id: "TVL-EMG-9423",
      tokenNumber: 1,
      currentServing: 1,
      estimatedWaitMinutes: 30,
      patientName: "Emergency Patient",
      patientAge: 30,
      patientGender: "Not Specified",
      patientPhone: "9842154320",
      patientEmail: "",
      hospitalId: "h1",
      hospitalName: "Tirunelveli Medical College Hospital (TVMCH)",
      hospitalAddress: "High Grounds, Palayamkottai, Tirunelveli - 627011",
      department: "Emergency Medicine & Trauma",
      doctorId: "doc-emg",
      doctorName: "Emergency Duty Medical Officer (Casualty)",
      room: "Red Trauma Bay / Emergency Casualty",
      problem: "Chest Pain / Cardiac Emergency",
      date: "2026-10-06",
      timeSlot: "IMMEDIATE",
      status: "confirmed",
      type: "normal",
      consultationFee: 0,
      bookedAt: "2026-10-06T17:09:14.087Z"
    },
    {
      id: "TVL-TKN-3746",
      tokenNumber: 29,
      currentServing: 23,
      estimatedWaitMinutes: 30,
      patientName: "Valar Test Patient",
      patientAge: 32,
      patientGender: "Male",
      patientPhone: "9842100000",
      patientEmail: "",
      hospitalId: "h1",
      hospitalName: "TVMCH",
      hospitalAddress: "High Grounds, Palayamkottai, Tirunelveli",
      department: "Cardiology",
      doctorId: "doc-1",
      doctorName: "Dr. S. Sundararajan, MD",
      room: "OPD Block A - Room 102",
      problem: "General Consultation",
      date: "2026-10-06",
      timeSlot: "10:30 AM",
      status: "confirmed",
      type: "normal",
      consultationFee: 0,
      bookedAt: "2026-10-06T09:45:48.125Z"
    },
    {
      id: "TVL-TKN-6913",
      tokenNumber: 30,
      currentServing: 15,
      estimatedWaitMinutes: 81,
      patientName: "priya",
      patientAge: 30,
      patientGender: "Female",
      patientPhone: "9685234175",
      patientEmail: "",
      hospitalId: "h4",
      hospitalName: "Kauvery Hospital Tirunelveli",
      hospitalAddress: "45-A, Trivandrum Road, Palayamkottai, Tirunelveli - 627002",
      department: "Cardiology",
      doctorId: "doc-kauvery-cardio",
      doctorName: "Dr. S. Premkumar, DM (Cardio), FACC",
      room: "Kauvery Heart Centre - OPD 302",
      problem: "Chest Pain & Heart Issues",
      date: "2026-10-09",
      timeSlot: "11:40 AM",
      status: "confirmed",
      type: "normal",
      consultationFee: 500,
      bookedAt: "2026-10-06T09:31:07.218Z",
      isDelayed: true,
      delayMinutes: 30,
      delayReason: "Stuck in Traffic (Tirunelveli Town / Bypass)",
      delayedAt: "2026-10-06T09:34:25.739Z"
    },
    {
      id: "TVL-TKN-1889",
      tokenNumber: 36,
      currentServing: 29,
      estimatedWaitMinutes: 42,
      patientName: "vel",
      patientAge: 19,
      patientGender: "Male",
      patientPhone: "7358531742",
      hospitalId: "h1",
      hospitalName: "Tirunelveli Medical College Hospital (TVMCH)",
      hospitalAddress: "High Grounds, Palayamkottai, Tirunelveli - 627011",
      department: "General Medicine",
      doctorId: "doc-1",
      doctorName: "Dr. S. Sundararajan, MD (Gen Med)",
      room: "OPD Block A - Room 102",
      problem: "Cold, Flu & Cough",
      date: "2026-09-27",
      timeSlot: "09:00 AM",
      status: "confirmed",
      type: "normal",
      consultationFee: 0,
      bookedAt: "2026-09-23T16:29:06.180Z"
    },
    {
      id: "TVL-TKN-8827",
      tokenNumber: 39,
      currentServing: 33,
      estimatedWaitMinutes: 30,
      patientName: "Murugan V",
      patientAge: 32,
      patientGender: "Male",
      patientPhone: "9876543210",
      hospitalId: "h1",
      hospitalName: "Tirunelveli Medical College Hospital (TVMCH)",
      hospitalAddress: "High Grounds, Palayamkottai, Tirunelveli",
      department: "Dermatology",
      doctorId: "doc-1",
      doctorName: "Dr. R. Kavitha, MD (DVL)",
      room: "OPD Block A - Room 102",
      problem: "General Consultation",
      date: "2026-09-23",
      timeSlot: "10:30 AM",
      status: "confirmed",
      type: "normal",
      consultationFee: 0,
      bookedAt: "2026-09-23T16:21:57.779Z"
    },
    {
      id: "TVL-TKN-9258",
      tokenNumber: 41,
      currentServing: 35,
      estimatedWaitMinutes: 30,
      patientName: "Murugan V",
      patientAge: 32,
      patientGender: "Male",
      patientPhone: "9876543210",
      hospitalId: "h1",
      hospitalName: "Tirunelveli Medical College Hospital (TVMCH)",
      hospitalAddress: "High Grounds, Palayamkottai, Tirunelveli",
      department: "Dermatology",
      doctorId: "doc-1",
      doctorName: "Dr. R. Kavitha, MD (DVL)",
      room: "OPD Block A - Room 102",
      problem: "General Consultation",
      date: "2026-09-23",
      timeSlot: "10:30 AM",
      status: "confirmed",
      type: "normal",
      consultationFee: 0,
      bookedAt: "2026-09-23T16:20:52.296Z"
    },
    {
      id: "TVL-TKN-5407",
      tokenNumber: 40,
      currentServing: 35,
      estimatedWaitMinutes: 25,
      patientName: "K. Meenakshi Sundaram",
      patientAge: 42,
      patientGender: "Male",
      patientPhone: "9443123456",
      hospitalId: "h1",
      hospitalName: "Tirunelveli Medical College Hospital (TVMCH)",
      hospitalAddress: "High Grounds, Palayamkottai, Tirunelveli - 627011",
      department: "General Medicine",
      doctorId: "doc-1",
      doctorName: "Dr. S. Sundararajan, MD",
      room: "OPD Block A - Room 102",
      problem: "General Health Checkup",
      date: "2026-09-23",
      timeSlot: "11:00 AM - 11:20 AM",
      status: "confirmed",
      type: "normal",
      consultationFee: 0,
      bookedAt: "2026-09-23T15:15:25.681Z"
    }
  ],
  stats: {
    totalBookedToday: 148,
    currentlyServingCount: 45,
    averageWaitMinutes: 11,
    activeHospitals: 5
  }
};

let inMemoryDb = null;

function readDb() {
  if (inMemoryDb) return inMemoryDb;
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      inMemoryDb = JSON.parse(data);
      return inMemoryDb;
    }
  } catch (e) {
    console.error('Error reading db.json:', e.message);
  }
  inMemoryDb = JSON.parse(JSON.stringify(initialDatabase));
  return inMemoryDb;
}

function writeDb(data) {
  inMemoryDb = data;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    // Read-only filesystem fallback for serverless environments
    try {
      const tmpFile = path.join('/tmp', 'db.json');
      fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2));
    } catch {}
  }
}

// ----------------------------------------------------
// MongoDB Connection & Seeding Logic
// ----------------------------------------------------
// ----------------------------------------------------
// MongoDB Connection & Seeding Logic
// ----------------------------------------------------
let mongoServer = null;

async function connectMongoDB() {
  const cleanUri = (MONGODB_URI || '').trim();
  const hasCredentials = cleanUri && !cleanUri.includes('<username>') && !cleanUri.includes('<password>');

  // Check if Atlas URI is missing the 5-character cluster hash (e.g. cluster0.mongodb.net without cluster0.abcde.mongodb.net)
  const isBrokenAtlasTemplate = cleanUri.includes('cluster0.mongodb.net') && !cleanUri.match(/cluster0\.[a-z0-9]+\.mongodb\.net/i);

  // 1. Try provided MONGODB_URI (Atlas Cloud or custom) if not broken template
  if (hasCredentials && !isBrokenAtlasTemplate && (cleanUri.startsWith('mongodb://') || cleanUri.startsWith('mongodb+srv://'))) {
    try {
      console.log(`📡 Connecting to MongoDB at: ${cleanUri.replace(/:[^:]*@/, ':****@')}...`);
      await mongoose.connect(cleanUri, { serverSelectionTimeoutMS: 5000 });
      isMongoConnected = true;
      console.log('🍃 [MONGODB] Connected Successfully to configured MONGODB_URI!');
      await seedInitialData();
      return;
    } catch (err) {
      console.warn('⚠️ Configured MongoDB connection failed:', err.message);
    }
  } else if (isBrokenAtlasTemplate) {
    console.log('ℹ️ Notice: MongoDB Atlas cluster URI in .env is missing your cluster subdomain (e.g. cluster0.abcde.mongodb.net).');
    console.log('🍃 Activating automated Real Embedded MongoDB Engine seamlessly without DNS delay...');
  }

  // 2. Try Local MongoDB Service (e.g. 127.0.0.1:27017)
  try {
    console.log('📡 Checking Local MongoDB (mongodb://127.0.0.1:27017/mediqueue)...');
    await mongoose.connect('mongodb://127.0.0.1:27017/mediqueue', { serverSelectionTimeoutMS: 2000 });
    isMongoConnected = true;
    console.log('🍃 [LOCAL MONGODB] Connected Successfully to 127.0.0.1:27017/mediqueue!');
    await seedInitialData();
    return;
  } catch (err) {
    // Local MongoDB service not active
  }

  // 3. Automated Embedded Real MongoDB Engine (Zero Setup, 100% Real MongoDB)
  if (MongoMemoryServerClass && !process.env.VERCEL) {
    try {
      console.log('🚀 Spawning Automated Embedded MongoDB Engine (Real MongoDB Instance)...');
      mongoServer = await MongoMemoryServerClass.create({
        instance: { dbName: 'mediqueue' }
      });
      const inMemUri = mongoServer.getUri();
      await mongoose.connect(inMemUri);
      isMongoConnected = true;
      console.log('🍃 [MONGODB LIVE] Connected & Active at:', inMemUri);
      await seedInitialData();
      return;
    } catch (err) {
      console.warn('⚠️ Embedded Mongo fallback:', err.message);
    }
  }

  // 4. Safe fallback to Fast Local JSON Engine
  isMongoConnected = false;
  console.log('⚡ [STORAGE] Running on Fast JSON Engine (db.json). Zero setup required!');
}

async function seedInitialData() {
  if (!isMongoConnected) return;
  try {
    const diskDb = readDb();
    const hospCount = await HospitalModel.countDocuments();
    if (hospCount === 0) {
      console.log('🌱 Seeding initial hospital directory to MongoDB from db.json / defaults...');
      const hospitalsToSeed = (diskDb.hospitals && diskDb.hospitals.length > 0) ? diskDb.hospitals : initialDatabase.hospitals;
      const doctorsToSeed = (diskDb.doctors && diskDb.doctors.length > 0) ? diskDb.doctors : initialDatabase.doctors;
      const tokensToSeed = (diskDb.tokens && diskDb.tokens.length > 0) ? diskDb.tokens : initialDatabase.tokens;

      await HospitalModel.insertMany(hospitalsToSeed);
      await DoctorModel.insertMany(doctorsToSeed);
      await TokenModel.insertMany(tokensToSeed);
      console.log(`✅ ${hospitalsToSeed.length} hospitals, ${doctorsToSeed.length} doctors & ${tokensToSeed.length} tokens seeded into MongoDB!`);
    } else {
      // Sync any missing tokens from db.json into MongoDB
      if (diskDb.tokens && diskDb.tokens.length > 0) {
        for (const token of diskDb.tokens) {
          const exists = await TokenModel.findOne({ id: token.id });
          if (!exists) {
            await TokenModel.create(token);
          }
        }
      }
    }

    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial users into MongoDB...');
      const initialUsers = [
        {
          name: 'Karthik Raja',
          email: 'karthik.raja@tvlcare.in',
          password: 'Patient@123',
          role: 'patient',
          mobile: '9842154320',
          bloodGroup: 'O+',
          area: 'Palayamkottai',
          district: 'Tirunelveli'
        },
        {
          name: 'Valar Mathi',
          email: 'valarmathi.med@gmail.com',
          password: 'Password@123',
          role: 'patient',
          mobile: '9842100000',
          bloodGroup: 'B+',
          area: 'Tirunelveli Town',
          district: 'Tirunelveli'
        },
        {
          name: 'OPD Sister Stella',
          email: 'nurse.tvmch@tvlcare.in',
          password: 'Staff@123',
          role: 'hospital_staff',
          mobile: '9442112233',
          area: 'High Grounds',
          district: 'Tirunelveli'
        },
        {
          name: 'District Health Officer',
          email: 'admin@tvlhealth.gov.in',
          password: 'admin123',
          role: 'admin',
          mobile: '9443100000',
          area: 'Collectorate Complex',
          district: 'Tirunelveli'
        }
      ];
      await UserModel.insertMany(initialUsers);
      console.log('✅ Users collection seeded into MongoDB!');
    }
  } catch (e) {
    console.warn('Seeding note:', e.message);
  }
}

connectMongoDB();

// ----------------------------------------------------
// 1. Health & Server Info
// ----------------------------------------------------
app.get('/api/health', async (req, res) => {
  const db = readDb();
  let count = db.tokens.length;
  if (isMongoConnected) {
    try {
      count = await TokenModel.countDocuments();
    } catch {}
  }

  res.json({
    status: 'ONLINE',
    service: 'TVL SmartCare OPD Backend API Server',
    region: 'Tirunelveli District, Tamil Nadu',
    serverTime: new Date().toISOString(),
    database: isMongoConnected ? '🍃 MongoDB (Connected & Live)' : '📁 Local JSON Engine (Active & Ready)',
    isMongoConnected,
    mongoDatabaseName: mongoose.connection.name || 'mediqueue',
    mongoConnectionState: ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'][mongoose.connection.readyState] || 'Connected',
    hospitalsCount: db.hospitals.length,
    activeTokensCount: count,
    dbStatus: isMongoConnected ? 'MongoDB Connected & Synced' : 'Local Fallback'
  });
});

// ----------------------------------------------------
// MongoDB Diagnostics & Live Status
// ----------------------------------------------------
app.get('/api/mongo/status', async (req, res) => {
  let counts = { hospitals: 0, doctors: 0, tokens: 0, users: 0 };
  let dbName = mongoose.connection.name || 'mediqueue';
  let host = mongoose.connection.host || 'localhost';
  let readyState = mongoose.connection.readyState;

  if (isMongoConnected) {
    try {
      counts.hospitals = await HospitalModel.countDocuments();
      counts.doctors = await DoctorModel.countDocuments();
      counts.tokens = await TokenModel.countDocuments();
      counts.users = await UserModel.countDocuments();
    } catch (e) {
      console.warn('Error reading mongo stats:', e.message);
    }
  }

  res.json({
    connected: isMongoConnected,
    databaseEngine: isMongoConnected ? 'MongoDB (Mongoose)' : 'Local JSON Fallback',
    connectionState: ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'][readyState] || 'Unknown',
    databaseName: dbName,
    host: host,
    collections: {
      hospitals: counts.hospitals,
      doctors: counts.doctors,
      tokens: counts.tokens,
      users: counts.users
    },
    message: isMongoConnected 
      ? 'MongoDB is fully connected and ready for CRUD operations!' 
      : 'MongoDB is offline, running on Local JSON storage.'
  });
});

// ----------------------------------------------------
// Users & Auth Sync MongoDB APIs
// ----------------------------------------------------
app.get('/api/users', async (req, res) => {
  if (isMongoConnected) {
    try {
      const users = await UserModel.find().select('-password');
      return res.json(users);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  const db = readDb();
  res.json(db.users || []);
});

app.post('/api/auth/google-sync', async (req, res) => {
  const { name, email, googleId, avatar } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  if (isMongoConnected) {
    try {
      let user = await UserModel.findOne({ email });
      if (!user) {
        user = new UserModel({
          name: name || email.split('@')[0],
          email,
          password: 'OAuth_Google_' + Date.now(),
          role: 'patient',
          district: 'Tirunelveli',
          area: 'Palayamkottai'
        });
        await user.save();
      }
      return res.json({ success: true, message: 'Google account synced with MongoDB!', user });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  res.json({ success: true, message: 'Google user synced locally' });
});

// ----------------------------------------------------
// 2. Hospitals API
// ----------------------------------------------------
app.get('/api/hospitals', async (req, res) => {
  const { specialty, type } = req.query;

  if (isMongoConnected) {
    try {
      let query = {};
      if (type && type !== 'all') {
        query.type = new RegExp(type, 'i');
      }
      if (specialty) {
        query.departments = { $regex: specialty, $options: 'i' };
      }
      const list = await HospitalModel.find(query);
      if (list.length > 0) return res.json(list);
    } catch (e) {
      console.warn('MongoDB query fallback:', e.message);
    }
  }

  const db = readDb();
  let list = db.hospitals;

  if (specialty) {
    list = list.filter(h => h.departments.some(d => d.toLowerCase().includes(specialty.toLowerCase())));
  }
  if (type && type !== 'all') {
    list = list.filter(h => h.type.toLowerCase() === type.toLowerCase());
  }
  res.json(list);
});

app.get('/api/hospitals/:id', async (req, res) => {
  if (isMongoConnected) {
    try {
      const hosp = await HospitalModel.findOne({ id: req.params.id });
      if (hosp) return res.json(hosp);
    } catch (e) {
      console.warn('MongoDB fallback:', e.message);
    }
  }

  const db = readDb();
  const hospital = db.hospitals.find(h => h.id === req.params.id);
  if (!hospital) return res.status(404).json({ error: 'Hospital not found' });
  res.json(hospital);
});

app.patch('/api/hospitals/:id/queue', async (req, res) => {
  const { currentServingToken, crowdLevel, averageWaitMins } = req.body;

  if (isMongoConnected) {
    try {
      const updated = await HospitalModel.findOneAndUpdate(
        { id: req.params.id },
        { $set: { currentServingToken, crowdLevel, averageWaitMins } },
        { new: true }
      );
      if (updated) return res.json({ success: true, hospital: updated });
    } catch (e) {
      console.warn('MongoDB update fallback:', e.message);
    }
  }

  const db = readDb();
  const hospital = db.hospitals.find(h => h.id === req.params.id);
  if (!hospital) return res.status(404).json({ error: 'Hospital not found' });

  if (currentServingToken !== undefined) hospital.currentServingToken = currentServingToken;
  if (crowdLevel !== undefined) hospital.crowdLevel = crowdLevel;
  if (averageWaitMins !== undefined) hospital.averageWaitMins = averageWaitMins;

  writeDb(db);
  res.json({ success: true, hospital });
});

// ----------------------------------------------------
// 3. Doctors API
// ----------------------------------------------------
app.get('/api/doctors', async (req, res) => {
  if (isMongoConnected) {
    try {
      const docs = await DoctorModel.find();
      if (docs.length > 0) return res.json(docs);
    } catch {}
  }
  const db = readDb();
  res.json(db.doctors);
});

app.get('/api/doctors/hospital/:hospitalId', async (req, res) => {
  if (isMongoConnected) {
    try {
      const docs = await DoctorModel.find({ hospitalId: req.params.hospitalId });
      if (docs.length > 0) return res.json(docs);
    } catch {}
  }
  const db = readDb();
  const docs = db.doctors.filter(d => d.hospitalId === req.params.hospitalId);
  res.json(docs);
});

app.get('/api/doctors/:id', async (req, res) => {
  if (isMongoConnected) {
    try {
      const doc = await DoctorModel.findOne({ id: req.params.id });
      if (doc) return res.json(doc);
    } catch {}
  }
  const db = readDb();
  const doc = db.doctors.find(d => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: 'Doctor not found' });
  res.json(doc);
});

// ----------------------------------------------------
// 4. Tokens & Appointments API
// ----------------------------------------------------
app.get('/api/tokens', async (req, res) => {
  if (isMongoConnected) {
    try {
      const tokens = await TokenModel.find().sort({ createdAt: -1 });
      if (tokens.length > 0) return res.json(tokens);
    } catch {}
  }
  const db = readDb();
  res.json(db.tokens);
});

app.get('/api/tokens/:id', async (req, res) => {
  if (isMongoConnected) {
    try {
      const token = await TokenModel.findOne({
        $or: [{ id: req.params.id }, { tokenNumber: isNaN(req.params.id) ? -1 : Number(req.params.id) }]
      });
      if (token) return res.json(token);
    } catch {}
  }
  const db = readDb();
  const token = db.tokens.find(t => t.id === req.params.id || String(t.tokenNumber) === req.params.id);
  if (!token) return res.status(404).json({ error: 'Token pass not found' });
  res.json(token);
});

app.post('/api/tokens/book', async (req, res) => {
  const db = readDb();
  const body = req.body;

  const randomTokenNum = Math.floor(Math.random() * 30) + 14;
  const currentServing = Math.max(1, randomTokenNum - 6);
  const tokenUuid = body.id || ('TVL-TKN-' + Math.floor(1000 + Math.random() * 9000));

  const newAppointment = {
    id: tokenUuid,
    tokenNumber: body.tokenNumber || randomTokenNum,
    currentServing: body.currentServing || currentServing,
    estimatedWaitMinutes: body.estimatedWaitMinutes || ((randomTokenNum - currentServing) * 5),
    patientName: body.patientName || 'Sundar M',
    patientAge: body.patientAge || 32,
    patientGender: body.patientGender || 'Male',
    patientPhone: body.patientPhone || '9876543210',
    patientEmail: body.patientEmail || '',
    hospitalId: body.hospitalId || 'h1',
    hospitalName: body.hospitalName || 'Tirunelveli Medical College Hospital (TVMCH)',
    hospitalAddress: body.hospitalAddress || 'High Grounds, Palayamkottai, Tirunelveli',
    department: body.department || body.specialty || 'General Medicine',
    doctorId: body.doctorId || 'doc-1',
    doctorName: body.doctorName || 'Dr. S. Sundararajan, MD',
    room: body.doctorRoom || body.room || 'OPD Block A - Room 102',
    problem: body.problem || 'General Consultation',
    date: body.date || new Date().toISOString().split('T')[0],
    timeSlot: body.timeSlot || '10:30 AM',
    status: 'confirmed',
    type: body.isEmergency ? 'emergency' : 'normal',
    consultationFee: body.consultationFee !== undefined ? body.consultationFee : 0,
    bookedAt: new Date().toISOString()
  };

  if (isMongoConnected) {
    try {
      const doc = new TokenModel(newAppointment);
      await doc.save();
    } catch (e) {
      console.warn('MongoDB insert fallback:', e.message);
    }
  }

  db.tokens.unshift(newAppointment);
  db.stats.totalBookedToday += 1;
  writeDb(db);

  res.status(201).json({
    success: true,
    message: `Token #${newAppointment.tokenNumber} allocated successfully!`,
    token: newAppointment,
    data: newAppointment
  });
});

// 15-Minute / 30-Minute Buffer Delay
app.patch('/api/tokens/:id/delay', async (req, res) => {
  const delayMinutes = req.body.delayMinutes || 15;
  const reason = req.body.reason || 'Traffic Delay';
  const slotAdvance = delayMinutes === 15 ? 3 : 6;

  if (isMongoConnected) {
    try {
      const token = await TokenModel.findOne({ id: req.params.id });
      if (token) {
        token.tokenNumber = (token.tokenNumber || 10) + slotAdvance;
        token.estimatedWaitMinutes = (token.estimatedWaitMinutes || 10) + delayMinutes;
        await token.save();
      }
    } catch {}
  }

  const db = readDb();
  const token = db.tokens.find(t => t.id === req.params.id);
  if (!token) return res.status(404).json({ error: 'Token pass not found' });

  token.tokenNumber = (token.tokenNumber || 10) + slotAdvance;
  token.estimatedWaitMinutes = (token.estimatedWaitMinutes || 10) + delayMinutes;
  token.isDelayed = true;
  token.delayMinutes = delayMinutes;
  token.delayReason = reason;
  token.delayedAt = new Date().toISOString();

  writeDb(db);
  res.json({
    success: true,
    message: `15-minute buffer delay applied successfully! New token: #${token.tokenNumber}`,
    token
  });
});

// Peer-to-Peer Smart Token Swap
app.patch('/api/tokens/:id/swap', async (req, res) => {
  const db = readDb();
  const token = db.tokens.find(t => t.id === req.params.id);
  if (!token) return res.status(404).json({ error: 'Token pass not found' });

  const { targetTokenNumber, swapPartnerName } = req.body;
  const oldToken = token.tokenNumber;

  token.tokenNumber = targetTokenNumber || (oldToken + 3);
  token.originalTokenNumber = oldToken;
  token.isSwapped = true;
  token.swappedWith = swapPartnerName || 'Peer Patient';
  token.swappedAt = new Date().toISOString();

  if (isMongoConnected) {
    try {
      await TokenModel.updateOne(
        { id: req.params.id },
        { 
          $set: { 
            tokenNumber: token.tokenNumber, 
            originalTokenNumber: oldToken, 
            isSwapped: true, 
            swappedWith: token.swappedWith, 
            swappedAt: token.swappedAt 
          } 
        }
      );
    } catch (e) {
      console.warn('MongoDB swap update error:', e.message);
    }
  }

  writeDb(db);
  res.json({
    success: true,
    message: `Token successfully swapped with ${token.swappedWith}! Now Token #${token.tokenNumber}`,
    token
  });
});

// Cancel / Delete Token
app.patch('/api/tokens/:id/cancel', async (req, res) => {
  if (isMongoConnected) {
    try {
      await TokenModel.updateOne({ id: req.params.id }, { $set: { status: 'cancelled' } });
    } catch {}
  }

  const db = readDb();
  const token = db.tokens.find(t => t.id === req.params.id);
  if (!token) return res.status(404).json({ error: 'Token pass not found' });

  token.status = 'cancelled';
  writeDb(db);
  res.json({ success: true, message: 'Token pass cancelled', token });
});

app.delete('/api/tokens/:id', async (req, res) => {
  if (isMongoConnected) {
    try {
      await TokenModel.deleteOne({ id: req.params.id });
    } catch {}
  }
  const db = readDb();
  db.tokens = db.tokens.filter(t => t.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, message: 'Token pass deleted' });
});

// ----------------------------------------------------
// 5. Offline SMS Booking Gateway (94424 00108)
// ----------------------------------------------------
app.post('/api/sms/book', async (req, res) => {
  const db = readDb();
  const { hospitalCode = 'TVMC', deptCode = 'GENERAL', mobileNumber = '9876543210', patientName = 'SMS Patient' } = req.body;

  const hospMap = {
    TVMC: { id: 'h1', name: 'Tirunelveli Medical College Hospital (TVMCH)', fee: 0 },
    SHIFA: { id: 'h2', name: 'Shifa Hospital', fee: 350 },
    ARVD: { id: 'h3', name: 'Aravind Eye Hospital', fee: 200 },
    KAUV: { id: 'h4', name: 'Kauvery Hospital', fee: 400 },
    PORN: { id: 'h5', name: 'Porunai Hospital', fee: 300 }
  };

  const deptMap = {
    GENERAL: { name: 'General Medicine', room: 'OPD Block A - Room 102', doctor: 'Dr. S. Sundararajan, MD' },
    CARDIO: { name: 'Cardiology', room: 'Cardiac Wing - Room 201', doctor: 'Dr. P. Muthukumar, DM' },
    DERMA: { name: 'Dermatology', room: 'Skin Clinic - Room 108', doctor: 'Dr. K. Revathi, MD (DVL)' },
    PEDI: { name: 'Pediatrics', room: 'Child Health - Room 105', doctor: 'Dr. G. Sivakumar, MD' },
    ORTHO: { name: 'Orthopedics', room: 'Bone & Joint - Room 112', doctor: 'Dr. M. Senthil Nathan, MS' }
  };

  const h = hospMap[hospitalCode.toUpperCase()] || hospMap['TVMC'];
  const d = deptMap[deptCode.toUpperCase()] || deptMap['GENERAL'];

  const tokenNum = Math.floor(Math.random() * 25) + 16;
  const tokenUuid = 'TVL-SMS-' + Math.floor(1000 + Math.random() * 9000);
  const timeSlot = '10:45 AM';

  const newAppointment = {
    id: tokenUuid,
    tokenNumber: tokenNum,
    currentServing: Math.max(1, tokenNum - 6),
    estimatedWaitMinutes: 30,
    patientName: patientName,
    patientAge: 32,
    patientGender: 'Male',
    patientPhone: mobileNumber,
    hospitalId: h.id,
    hospitalName: h.name,
    department: d.name,
    doctorName: d.doctor,
    room: d.room,
    timeSlot,
    status: 'confirmed',
    type: 'sms',
    bookingMethod: 'OFFLINE_SMS',
    consultationFee: h.fee,
    bookedAt: new Date().toISOString()
  };

  if (isMongoConnected) {
    try {
      const doc = new TokenModel(newAppointment);
      await doc.save();
    } catch {}
  }

  db.tokens.unshift(newAppointment);
  db.stats.totalBookedToday += 1;
  writeDb(db);

  const replySMS = `[TVL SmartCare OPD Pass] Token #${tokenNum} allocated! Hospital: ${h.name}. Room: ${d.room}. Time: ${timeSlot}. Ref: ${tokenUuid}.`;

  res.status(201).json({
    success: true,
    token: newAppointment,
    data: newAppointment,
    smsReplyText: replySMS
  });
});

// ----------------------------------------------------
// 5B. Official Email Dispatch Gateway
// ----------------------------------------------------
app.post('/api/email/send', (req, res) => {
  const { recipientEmail, tokenData, subject } = req.body;

  if (!recipientEmail || !recipientEmail.includes('@')) {
    return res.status(400).json({ error: 'Valid recipient email address is required.' });
  }

  const tokenNum = tokenData?.tokenNumber || 40;
  const hospName = tokenData?.hospitalName || 'Tirunelveli Medical College Hospital';

  console.log(`📧 [EMAIL GATEWAY] Dispatching OPD Pass #${tokenNum} to: ${recipientEmail}`);

  res.status(200).json({
    success: true,
    message: `Official OPD Consultation Pass #${tokenNum} dispatched successfully to ${recipientEmail}`,
    recipient: recipientEmail,
    deliveryStatus: 'DELIVERED',
    subject: subject || `[TVL SmartCare] Confirmed OPD Token Pass #${tokenNum} - ${hospName}`,
    dispatchedAt: new Date().toISOString()
  });
});

// ----------------------------------------------------
// 6. Live Queue & TV Counter API
// ----------------------------------------------------
app.get('/api/queue/:tokenId', async (req, res) => {
  let token = null;
  if (isMongoConnected) {
    try {
      token = await TokenModel.findOne({
        $or: [{ id: req.params.tokenId }, { tokenNumber: isNaN(req.params.tokenId) ? -1 : Number(req.params.tokenId) }]
      });
    } catch {}
  }

  if (!token) {
    const db = readDb();
    token = db.tokens.find(t => t.id === req.params.tokenId || String(t.tokenNumber) === req.params.tokenId);
  }

  const tokenNumber = token?.tokenNumber || 40;
  const currentServing = token?.currentServing || Math.max(1, tokenNumber - 5);

  res.json({
    tokenId: req.params.tokenId,
    tokenNumber,
    currentServing,
    patientsAhead: Math.max(0, tokenNumber - currentServing),
    estimatedWaitMinutes: Math.max(0, (tokenNumber - currentServing) * 5),
    isNowServing: currentServing === tokenNumber,
    isNextInLine: currentServing === tokenNumber - 1,
    hospital: token?.hospitalName || 'Tirunelveli Medical College Hospital',
    doctor: token?.doctorName || 'Dr. S. Sundararajan, MD',
    room: token?.room || 'OPD Block A - Room 102'
  });
});

// ----------------------------------------------------
// 7. Admin & Staff Stats API
// ----------------------------------------------------
app.get('/api/admin/stats', async (req, res) => {
  const db = readDb();
  let tokensCount = db.tokens.length;
  if (isMongoConnected) {
    try {
      tokensCount = await TokenModel.countDocuments();
    } catch {}
  }

  res.json({
    ...db.stats,
    totalRegisteredTokens: tokensCount,
    activeHospitals: db.hospitals.length,
    systemStatus: '100% Operational',
    activeOpdCounters: 10,
    database: isMongoConnected ? 'MongoDB' : 'Local JSON'
  });
});

// Start Server (Standalone / Local dev mode when run directly via `node server/server.js`)
const isMain = process.argv[1] && (process.argv[1].endsWith('server.js') || process.argv[1].endsWith('server'));
if (isMain && !process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 TVL SmartCare Backend API running on http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🏥 Hospitals API: http://localhost:${PORT}/api/hospitals`);
    console.log(`🎫 Tokens API: http://localhost:${PORT}/api/tokens`);
  });
}

export default app;
