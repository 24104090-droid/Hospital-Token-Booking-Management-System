export const bloodBanks = [
  {
    id: 'bb-1',
    name: 'Tirunelveli Medical College Hospital (TVMCH) Blood Bank',
    type: 'Government Super-Specialty',
    hospitalId: 'h1',
    address: 'High Grounds, Palayamkottai, Tirunelveli - 627011',
    location: { lat: 8.7289, lng: 77.7023 },
    phone: '0462-2572733',
    helpline: '1800-425-1081',
    timing: '24 Hours / 7 Days Active',
    emergency24x7: true,
    componentSeparation: true, // Platelets, Packed RBC, FFP available
    stock: {
      'A+': 42,
      'A-': 8,
      'B+': 55,
      'B-': 6,
      'O+': 68,
      'O-': 12,
      'AB+': 28,
      'AB-': 4
    }
  },
  {
    id: 'bb-2',
    name: 'Shifa Hospital Blood Bank & Component Unit',
    type: 'Private NABH Accredited',
    hospitalId: 'h2',
    address: '82, Main Road, Tirunelveli Junction, Tirunelveli - 627001',
    location: { lat: 8.7350, lng: 77.7070 },
    phone: '0462-2323451',
    helpline: '+91 94433 21980',
    timing: '24/7 Emergency Casualty Desk',
    emergency24x7: true,
    componentSeparation: true,
    stock: {
      'A+': 24,
      'A-': 3,
      'B+': 31,
      'B-': 4,
      'O+': 36,
      'O-': 5,
      'AB+': 14,
      'AB-': 2
    }
  },
  {
    id: 'bb-3',
    name: 'Rotary Central Voluntary Blood Bank',
    type: 'Charitable & Voluntary Trust',
    hospitalId: null,
    address: 'Sripuram, Vannarpettai, Tirunelveli - 627003',
    location: { lat: 8.7320, lng: 77.6980 },
    phone: '0462-2500120',
    helpline: '+91 98421 55670',
    timing: '08:00 AM - 08:00 PM (Emergency on Call)',
    emergency24x7: true,
    componentSeparation: false,
    stock: {
      'A+': 18,
      'A-': 2,
      'B+': 22,
      'B-': 3,
      'O+': 29,
      'O-': 4,
      'AB+': 9,
      'AB-': 1
    }
  },
  {
    id: 'bb-4',
    name: 'Porunai Red Cross District Blood Bank',
    type: 'Indian Red Cross Society',
    hospitalId: null,
    address: 'Near Collectorate, Palayamkottai, Tirunelveli - 627009',
    location: { lat: 8.7210, lng: 77.7280 },
    phone: '0462-2572111',
    helpline: '+91 94422 77890',
    timing: '24/7 Emergency Dispatch',
    emergency24x7: true,
    componentSeparation: true,
    stock: {
      'A+': 15,
      'A-': 4,
      'B+': 19,
      'B-': 2,
      'O+': 24,
      'O-': 3,
      'AB+': 8,
      'AB-': 2
    }
  }
];

export const volunteerDonors = [
  {
    id: 'donor-1',
    name: 'M. Senthil Nathan',
    bloodGroup: 'O+',
    area: 'Palayamkottai, Tirunelveli',
    phone: '9843210111',
    lastDonated: '4 months ago',
    verified: true,
    readyToDonate: true
  },
  {
    id: 'donor-2',
    name: 'A. Fathima Banu',
    bloodGroup: 'B+',
    area: 'Tirunelveli Junction',
    phone: '9789123450',
    lastDonated: '6 months ago',
    verified: true,
    readyToDonate: true
  },
  {
    id: 'donor-3',
    name: 'K. Vigneshwaran',
    bloodGroup: 'A+',
    area: 'Vannarpettai, Tirunelveli',
    phone: '9443219870',
    lastDonated: '3 months ago',
    verified: true,
    readyToDonate: true
  },
  {
    id: 'donor-4',
    name: 'R. Rajesh Kannan',
    bloodGroup: 'O-',
    area: 'High Grounds, Tirunelveli',
    phone: '9944556677',
    lastDonated: '5 months ago',
    verified: true,
    readyToDonate: true
  },
  {
    id: 'donor-5',
    name: 'S. Mohamed Bilal',
    bloodGroup: 'AB+',
    area: 'Melapalayam, Tirunelveli',
    phone: '9842190823',
    lastDonated: '2 months ago',
    verified: true,
    readyToDonate: true
  },
  {
    id: 'donor-6',
    name: 'T. Subbalakshmi',
    bloodGroup: 'B-',
    area: 'Perumalpuram, Tirunelveli',
    phone: '9488776655',
    lastDonated: '7 months ago',
    verified: true,
    readyToDonate: true
  },
  {
    id: 'donor-7',
    name: 'G. Karthikeyan',
    bloodGroup: 'AB-',
    area: 'Samathanapuram, Tirunelveli',
    phone: '9787654321',
    lastDonated: '4 months ago',
    verified: true,
    readyToDonate: true
  },
  {
    id: 'donor-8',
    name: 'V. Anandhakumar',
    bloodGroup: 'A-',
    area: 'Thachanallur, Tirunelveli',
    phone: '9842233445',
    lastDonated: '5 months ago',
    verified: true,
    readyToDonate: true
  }
];

export const getBloodTotalUnits = (group = null) => {
  return bloodBanks.reduce((total, bank) => {
    if (group) {
      return total + (bank.stock[group] || 0);
    }
    return total + Object.values(bank.stock).reduce((a, b) => a + b, 0);
  }, 0);
};
