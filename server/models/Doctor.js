import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  hospitalId: { type: String, required: true, ref: 'Hospital' },
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  room: { type: String },
  experience: { type: String },
  rating: { type: Number, default: 4.8 },
  fee: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);
