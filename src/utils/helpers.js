export const formatTime = (minutes) => {
  if (minutes < 60) return `${minutes} mins`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return `${hours}h ${rem > 0 ? `${rem}m` : ''}`;
};

export const getCrowdBadgeColor = (crowdLevel) => {
  switch (crowdLevel?.toLowerCase()) {
    case 'low': return 'badge-success';
    case 'medium': return 'badge-warning';
    case 'high': return 'badge-danger';
    default: return 'badge-neutral';
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const generateQrString = (tokenData) => {
  return JSON.stringify({
    tokenId: tokenData.id,
    tokenNumber: tokenData.number,
    hospitalId: tokenData.hospitalId,
    patientName: tokenData.patientName || 'Patient',
    emergency: tokenData.emergency || false,
    timestamp: tokenData.createdAt
  });
};
