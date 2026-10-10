export const mockReportsData = {
  summary: {
    district: 'Tirunelveli District',
    totalTokensToday: 486,
    totalBookingsWeek: 1486,
    totalBookingsMonth: 5920,
    completedConsultations: 394,
    completedWeekly: 1248,
    completionRate: '86.1%',
    inQueueWaiting: 158,
    cancelledBookings: 48,
    cancellationRate: '3.2%',
    emergencyPriorityHandled: 28,
    avgWaitTimeMins: 14.2,
    waitTimeImprovement: '2.4 mins faster than last week',
    activeQueuesCount: 18,
    patientSatisfactionRate: '94.8%',
    totalFeesCollected: '₹1,42,800',
    freeGovtBeneficiaries: '78%'
  },
  peakHours: [
    { hour: '08:00 AM', tokens: 42, completed: 38, avgWait: 8, load: 'Low' },
    { hour: '09:00 AM', tokens: 88, completed: 74, avgWait: 15, load: 'Moderate' },
    { hour: '10:00 AM', tokens: 110, completed: 86, avgWait: 22, load: 'Peak Rush' },
    { hour: '11:00 AM', tokens: 95, completed: 82, avgWait: 18, load: 'High' },
    { hour: '12:00 PM', tokens: 60, completed: 52, avgWait: 12, load: 'Moderate' },
    { hour: '01:00 PM', tokens: 28, completed: 25, avgWait: 9, load: 'Low' },
    { hour: '03:00 PM', tokens: 45, completed: 38, avgWait: 11, load: 'Moderate' },
    { hour: '04:00 PM', tokens: 52, completed: 44, avgWait: 10, load: 'Moderate' },
    { hour: '05:00 PM', tokens: 39, completed: 35, avgWait: 9, load: 'Low' }
  ],
  weeklyTrend: [
    { day: 'Mon', bookings: 245, completed: 215, cancelled: 8, avgWait: 16 },
    { day: 'Tue', bookings: 228, completed: 202, cancelled: 6, avgWait: 14 },
    { day: 'Wed', bookings: 260, completed: 230, cancelled: 9, avgWait: 18 },
    { day: 'Thu', bookings: 210, completed: 188, cancelled: 7, avgWait: 13 },
    { day: 'Fri', bookings: 255, completed: 224, cancelled: 10, avgWait: 15 },
    { day: 'Sat', bookings: 198, completed: 175, cancelled: 5, avgWait: 12 },
    { day: 'Sun (Emerg)', bookings: 90, completed: 84, cancelled: 3, avgWait: 9 }
  ],
  departmentBreakdown: [
    { department: 'General Medicine', tokens: 165, completed: 142, avgWait: 12, rating: 4.7, percentage: 34 },
    { department: 'Cardiology', tokens: 72, completed: 64, avgWait: 18, rating: 4.9, percentage: 15 },
    { department: 'Pediatrics', tokens: 68, completed: 59, avgWait: 14, rating: 4.8, percentage: 14 },
    { department: 'Dermatology', tokens: 54, completed: 48, avgWait: 11, rating: 4.6, percentage: 11 },
    { department: 'Orthopedics', tokens: 48, completed: 39, avgWait: 20, rating: 4.5, percentage: 10 },
    { department: 'Ophthalmology', tokens: 45, completed: 42, avgWait: 9, rating: 4.9, percentage: 9 },
    { department: 'ENT', tokens: 34, completed: 30, avgWait: 10, rating: 4.7, percentage: 7 }
  ],
  hospitalPerformance: [
    { name: 'TVMCH Tirunelveli', type: 'Government', district: 'Tirunelveli', tokensServed: 215, totalBookings: 245, completed: 215, avgWait: 14, efficiency: '96%', queueLoad: 'Moderate', bedsOccupied: '88%' },
    { name: 'Sree Mookambika Hospital', type: 'Private', district: 'Tirunelveli', tokensServed: 98, totalBookings: 108, completed: 98, avgWait: 12, efficiency: '98%', queueLoad: 'Low', bedsOccupied: '64%' },
    { name: 'District GH Tirunelveli', type: 'Government', district: 'Tirunelveli', tokensServed: 84, totalBookings: 96, completed: 84, avgWait: 11, efficiency: '92%', queueLoad: 'Moderate', bedsOccupied: '82%' },
    { name: 'Apollo Specialty Hospitals', type: 'Private', district: 'Tirunelveli', tokensServed: 54, totalBookings: 58, completed: 54, avgWait: 15, efficiency: '99%', queueLoad: 'Low', bedsOccupied: '70%' },
    { name: 'Shifa Hospital', type: 'Private', district: 'Tirunelveli', tokensServed: 48, totalBookings: 52, completed: 48, avgWait: 13, efficiency: '95%', queueLoad: 'Low', bedsOccupied: '58%' },
    { name: 'Eye Care Center', type: 'Private', district: 'Tirunelveli', tokensServed: 35, totalBookings: 38, completed: 35, avgWait: 8, efficiency: '99%', queueLoad: 'Low', bedsOccupied: '45%' },
    { name: 'Tenkasi District GH', type: 'Government', district: 'Tenkasi', tokensServed: 62, totalBookings: 70, completed: 62, avgWait: 16, efficiency: '91%', queueLoad: 'Moderate', bedsOccupied: '79%' }
  ],
  bookingChannels: [
    { channel: 'Smart Web Portal', percentage: 52, count: 252, icon: 'Globe' },
    { channel: 'QR Express Gate Scan', percentage: 26, count: 126, icon: 'QrCode' },
    { channel: 'Offline SMS / USSD', percentage: 14, count: 68, icon: 'MessageSquare' },
    { channel: 'Hospital Walk-in Kiosk', percentage: 8, count: 40, icon: 'Tv' }
  ],
  waitTimeDistribution: [
    { range: '< 10 mins', count: 185, percentage: 38 },
    { range: '10 - 20 mins', count: 210, percentage: 43 },
    { range: '20 - 30 mins', count: 65, percentage: 13 },
    { range: '> 30 mins', count: 26, percentage: 6 }
  ],
  recentBookingActivity: [
    { id: 'bkg-101', tokenNumber: 'TVMCH-048', patientName: 'Murugan P.', hospitalName: 'TVMCH Tirunelveli', department: 'General Medicine', channel: 'QR Scan', timestamp: '10:48 AM', status: 'Serving', fee: 'Free (₹0)' },
    { id: 'bkg-102', tokenNumber: 'APO-019', patientName: 'Sudha R.', hospitalName: 'Apollo Specialty', department: 'Cardiology', channel: 'Web Portal', timestamp: '10:45 AM', status: 'In-Consultation', fee: '₹500' },
    { id: 'bkg-103', tokenNumber: 'SHF-042', patientName: 'Syed Ali', hospitalName: 'Shifa Hospital', department: 'Cardiology', channel: 'Web Portal', timestamp: '10:40 AM', status: 'Serving', fee: '₹300' },
    { id: 'bkg-104', tokenNumber: 'TVMCH-049', patientName: 'Kalaiarasi M.', hospitalName: 'TVMCH Tirunelveli', department: 'Obstetrics & Gyn', channel: 'SMS', timestamp: '10:35 AM', status: 'Waiting', fee: 'Free (₹0)' },
    { id: 'bkg-105', tokenNumber: 'EYE-045', patientName: 'Subbiah T.', hospitalName: 'Eye Care Center', department: 'Ophthalmology', channel: 'QR Scan', timestamp: '10:30 AM', status: 'Completed', fee: '₹250' },
    { id: 'bkg-106', tokenNumber: 'DGH-208', patientName: 'Gomathi N.', hospitalName: 'District GH Tirunelveli', department: 'Pediatrics', channel: 'Kiosk', timestamp: '10:25 AM', status: 'Completed', fee: 'Free (₹0)' }
  ]
};
