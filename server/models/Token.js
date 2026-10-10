import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  tokenNumber: { type: Number, required: true },
  currentServing: { type: Number, default: 1 },
  estimatedWaitMinutes: { type: Number, default: 15 },
  patientName: { type: String, required: true },
  patientAge: { type: Number },
  patientGender: { type: String },
  patientPhone: { type: String, required: true },
  patientEmail: { type: String },
  hospitalId: { type: String, required: true },
  hospitalName: { type: String, required: true },
  hospitalAddress: { type: String },
  department: { type: String },
  doctorId: { type: String },
  doctorName: { type: String },
  room: { type: String },
  problem: { type: String },
  date: { type: String, required: true },
  timeSlot: { type: String },
  status: { 
    type: String, 
    enum: ['confirmed', 'serving', 'completed', 'cancelled'], 
    default: 'confirmed' 
  },
  type: { type: String, default: 'normal' },
  consultationFee: { type: Number, default: 0 },
  bookedAt: { type: Date, default: Date.now }
}, { timestamps: true, strict: false });

export default mongoose.models.Token || mongoose.model('Token', TokenSchema);
