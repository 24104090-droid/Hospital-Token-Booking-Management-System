import mongoose from 'mongoose';

const HospitalSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, default: 'Government' },
  district: { type: String, default: 'Tirunelveli' },
  area: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String },
  emergencyPhone: { type: String },
  rating: { type: Number, default: 4.5 },
  consultationFee: { type: Number, default: 0 },
  currentServingToken: { type: Number, default: 1 },
  totalTokensIssuedToday: { type: Number, default: 0 },
  averageWaitMins: { type: Number, default: 10 },
  crowdLevel: { type: String, default: 'Normal' },
  departments: [{ type: String }],
  location: {
    lat: { type: Number },
    lng: { type: Number }
  }
}, { timestamps: true });

export default mongoose.models.Hospital || mongoose.model('Hospital', HospitalSchema);
