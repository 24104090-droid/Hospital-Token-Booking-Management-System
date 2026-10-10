import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String },
  role: { 
    type: String, 
    enum: ['patient', 'doctor', 'hospital_staff', 'admin'], 
    default: 'patient' 
  },
  age: { type: Number },
  gender: { type: String },
  bloodGroup: { type: String },
  area: { type: String },
  district: { type: String, default: 'Tirunelveli' }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
