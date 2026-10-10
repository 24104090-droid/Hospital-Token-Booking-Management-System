export const isValidIndianPhone = (phone) => {
  const cleaned = (phone || '').replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(cleaned.slice(-10));
};

export const isValidEmail = (email) => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidAge = (age) => {
  const num = parseInt(age, 10);
  return !isNaN(num) && num > 0 && num <= 125;
};

export const isValidName = (name) => {
  return typeof name === 'string' && name.trim().length >= 2;
};

export const validateBookingForm = ({ patientName, patientAge, patientPhone, hospitalId, doctorId, timeSlot }) => {
  const errors = {};
  if (!isValidName(patientName)) errors.patientName = 'Please enter a valid patient name (min 2 letters)';
  if (!isValidAge(patientAge)) errors.patientAge = 'Please enter a valid age between 1 and 125';
  if (!isValidIndianPhone(patientPhone)) errors.patientPhone = 'Please enter a valid 10-digit mobile number';
  if (!hospitalId) errors.hospitalId = 'Please select a hospital';
  if (!doctorId) errors.doctorId = 'Please select a consulting doctor';
  if (!timeSlot) errors.timeSlot = 'Please select a time slot';

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
