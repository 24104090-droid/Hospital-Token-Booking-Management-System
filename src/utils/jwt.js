/**
 * JWT (JSON Web Token) Utility for TVL SmartCare
 * Implements JWT structure: Header.Payload.Signature (Base64Url encoded)
 * Provides token creation, verification, decoding, and claims inspection.
 */

// Simple Base64Url encode/decode helpers
export const base64UrlEncode = (str) => {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const base64UrlDecode = (str) => {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return decodeURIComponent(escape(atob(str)));
};

/**
 * Generate a valid JWT token simulation
 * @param {Object} payloadData - User payload claims
 * @param {number} expiresInMinutes - Token expiration duration
 * @returns {string} - Complete JWT String (header.payload.signature)
 */
export const generateJWT = (payloadData, expiresInMinutes = 120) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
    iss: 'tvl-smartcare-auth'
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: payloadData.id,
    name: payloadData.name,
    email: payloadData.email,
    role: payloadData.role || 'patient',
    hospitalId: payloadData.hospitalId || null,
    hospitalName: payloadData.hospitalName || null,
    authProvider: payloadData.authProvider || 'local',
    iat: now,
    exp: now + expiresInMinutes * 60,
    iss: 'https://auth.tvlsmartcare.tn.gov.in',
    aud: 'https://api.tvlsmartcare.tn.gov.in'
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  
  // Simulated HMAC-SHA256 signature hash
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  let hash = 0;
  for (let i = 0; i < signatureInput.length; i++) {
    const char = signatureInput.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  const mockSignature = base64UrlEncode(`sig_${Math.abs(hash)}_${Date.now()}`);

  return `${encodedHeader}.${encodedPayload}.${mockSignature}`;
};

/**
 * Decode and parse a JWT string
 * @param {string} token
 * @returns {Object|null} - Decoded token object with header, payload, isExpired
 */
export const decodeJWT = (token) => {
  if (!token || typeof token !== 'string') return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const signature = parts[2];

    const now = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp ? payload.exp < now : false;
    const remainingSeconds = payload.exp ? Math.max(0, payload.exp - now) : null;

    return {
      header,
      payload,
      signature,
      isExpired,
      remainingSeconds,
      raw: token
    };
  } catch (err) {
    console.error('Failed to decode JWT:', err);
    return null;
  }
};

/**
 * Verify token validity and expiration
 */
export const isTokenValid = (token) => {
  const decoded = decodeJWT(token);
  return decoded !== null && !decoded.isExpired;
};

/**
 * Get HTTP Authorization header for fetch/axios
 */
export const getAuthHeader = () => {
  const token = localStorage.getItem('tvl_jwt_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
