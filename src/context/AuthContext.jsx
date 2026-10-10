import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateJWT, decodeJWT, isTokenValid } from '../utils/jwt';
import { mockUsers, getUserByEmail } from '../data/users';
import { saveGoogleAccount } from '../utils/googleAuth';
import toast from 'react-hot-toast';

export const sanitizePatientName = (name, mobileNumber = '') => {
  if (!name || typeof name !== 'string') return 'Patient';
  // Check if name contains pattern like "Patient (+91 ...)" or "+91" or mobile digits
  if (name.includes('(+91') || /\+91\s*\d+/.test(name) || /Patient\s*\(\+?91/i.test(name)) {
    if (mobileNumber) {
      const saved = localStorage.getItem(`tvl_patient_name_${mobileNumber}`);
      if (saved && !saved.includes('(+91') && !/\+91\s*\d+/.test(saved)) {
        return saved.trim();
      }
    }
    return 'Patient';
  }
  return name.trim();
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('tvl_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const cleaned = sanitizePatientName(parsed.name, parsed.mobile);
        if (cleaned !== parsed.name) {
          parsed.name = cleaned;
          localStorage.setItem('tvl_user', JSON.stringify(parsed));
        }
        return parsed;
      }
      return mockUsers[0]; // Default to first user (Karthik Raja)
    } catch {
      return mockUsers[0];
    }
  });

  const [jwtToken, setJwtToken] = useState(() => {
    return localStorage.getItem('tvl_jwt_token') || null;
  });

  const [decodedClaims, setDecodedClaims] = useState(() => {
    const token = localStorage.getItem('tvl_jwt_token');
    return token ? decodeJWT(token) : null;
  });

  const [loading, setLoading] = useState(false);

  // Initialize or renew JWT token on mount
  useEffect(() => {
    if (user && (!jwtToken || !isTokenValid(jwtToken))) {
      const token = generateJWT(user, 240); // 4 hours
      setJwtToken(token);
      setDecodedClaims(decodeJWT(token));
      localStorage.setItem('tvl_jwt_token', token);
      localStorage.setItem('tvl_user', JSON.stringify(user));
    }
  }, [user]);

  /**
   * Password Login with JWT Token Generation
   */
  const login = async (email, password, role = 'patient') => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      
      const foundUser = getUserByEmail(email);
      
      if (!foundUser) {
        // Allow demo login with entered email
        const newUser = {
          id: 'usr_' + Date.now(),
          name: email.split('@')[0].replace(/[._]/g, ' '),
          email,
          role,
          bloodGroup: 'O+',
          area: 'Tirunelveli Town',
          district: 'Tirunelveli',
          mobile: '9842100000',
          healthId: 'TVL-TN-DEMO-' + Math.floor(1000 + Math.random() * 9000),
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        };
        const token = generateJWT(newUser);
        setUser(newUser);
        setJwtToken(token);
        setDecodedClaims(decodeJWT(token));
        localStorage.setItem('tvl_user', JSON.stringify(newUser));
        localStorage.setItem('tvl_jwt_token', token);
        toast.success(`Welcome to TVL SmartCare, ${newUser.name}!`);
        return { success: true, user: newUser, token };
      }

      // Check password if matching preconfigured user
      if (password && foundUser.password && foundUser.password !== password && password !== 'password123' && password !== 'Patient@123' && password !== 'Staff@123' && password !== 'admin123') {
        toast.error('Invalid password. Please check your credentials.');
        return { success: false, error: 'Invalid password. Please check your credentials.' };
      }

      const token = generateJWT(foundUser);
      setUser(foundUser);
      setJwtToken(token);
      setDecodedClaims(decodeJWT(token));
      localStorage.setItem('tvl_user', JSON.stringify(foundUser));
      localStorage.setItem('tvl_jwt_token', token);
      toast.success(`Signed in as ${foundUser.name} (${foundUser.role.toUpperCase()})`);
      return { success: true, user: foundUser, token };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * 1-Click Fast Login for Testing/Evaluations
   */
  const loginAsUser = (targetUser) => {
    const token = generateJWT(targetUser);
    setUser(targetUser);
    setJwtToken(token);
    setDecodedClaims(decodeJWT(token));
    localStorage.setItem('tvl_user', JSON.stringify(targetUser));
    localStorage.setItem('tvl_jwt_token', token);
    toast.success(`Switched account to: ${targetUser.name} (${targetUser.role.toUpperCase()})`);
  };

  /**
   * OAuth 2.0 Provider Authentication Flow (Google / GitHub / TN Health ID)
   */
  const loginWithOAuth = async (provider = 'google', customData = null) => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 400));

      let oauthUser;
      if (provider === 'google') {
        const email = customData?.email || 'karthik.raja.google@gmail.com';
        const name = customData?.name || email.split('@')[0].replace(/[._]/g, ' ');
        const avatar = customData?.picture || customData?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0284c7&color=fff`;
        const googleId = customData?.sub || customData?.id || customData?.googleId || ('g_' + Date.now());

        oauthUser = {
          id: 'usr_g_' + (String(googleId).length > 8 ? String(googleId).slice(-8) : googleId),
          googleId,
          name,
          email,
          role: 'patient',
          authProvider: 'Google OAuth 2.0',
          bloodGroup: customData?.bloodGroup || 'B+',
          mobile: customData?.mobile || '9842154320',
          area: customData?.area || 'Palayamkottai',
          district: 'Tirunelveli',
          healthId: 'ABHA-TN-' + Math.floor(1000 + Math.random() * 9000),
          avatar,
          emailVerified: true
        };

        // Cache into local system accounts for fast chooser
        saveGoogleAccount(oauthUser);
      } else if (provider === 'github') {
        oauthUser = {
          id: 'oauth_gh_' + Date.now(),
          name: 'Dev Karthik (GitHub)',
          email: 'karthik.dev@github.com',
          role: 'patient',
          authProvider: 'GitHub OAuth',
          bloodGroup: 'A+',
          mobile: '9842188888',
          area: 'Tirunelveli Junction',
          district: 'Tirunelveli',
          healthId: 'ABHA-TN-7766-5432',
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80'
        };
      } else {
        // Tamil Nadu Health ID (NDHM / ABDM)
        oauthUser = {
          id: 'oauth_tn_' + Date.now(),
          name: 'Meenakshi Sundaram (TN Health ID)',
          email: 'meenakshi.tnhealth@gov.in',
          role: 'patient',
          authProvider: 'TN Health ID / ABDM',
          bloodGroup: 'B+',
          mobile: '9443187650',
          area: 'Vannarpettai',
          district: 'Tirunelveli',
          healthId: 'TN-EHR-3344-9900',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
        };
      }

      const token = generateJWT(oauthUser);
      setUser(oauthUser);
      setJwtToken(token);
      setDecodedClaims(decodeJWT(token));
      localStorage.setItem('tvl_user', JSON.stringify(oauthUser));
      localStorage.setItem('tvl_jwt_token', token);
      toast.success(`Welcome, ${oauthUser.name}! Signed in via ${oauthUser.authProvider}.`);
      return { success: true, user: oauthUser, token };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mobile OTP Login
   */
  const loginWithOTP = async (mobileNumber) => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      toast.success(`OTP code sent successfully to +91 ${mobileNumber}`);
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTPAndLogin = async (mobileNumber, otpCode, patientName = '') => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      if (!otpCode || otpCode.length < 4) {
        toast.error('Please enter a valid OTP code');
        return { success: false, error: 'Invalid OTP' };
      }

      const matchedMockUser = mockUsers.find(u => u.mobile === mobileNumber);
      const savedStoredName = localStorage.getItem(`tvl_patient_name_${mobileNumber}`);

      let cleanName = 'Patient';
      if (patientName && patientName.trim()) {
        cleanName = sanitizePatientName(patientName.trim(), mobileNumber);
      } else if (savedStoredName) {
        cleanName = sanitizePatientName(savedStoredName, mobileNumber);
      } else if (matchedMockUser?.name) {
        cleanName = matchedMockUser.name;
      }

      if (cleanName && cleanName !== 'Patient') {
        localStorage.setItem(`tvl_patient_name_${mobileNumber}`, cleanName);
      }

      const otpUser = {
        id: matchedMockUser?.id || ('usr_otp_' + mobileNumber.slice(-4)),
        name: cleanName,
        email: matchedMockUser?.email || `patient.${mobileNumber.slice(-4)}@tvlcare.in`,
        mobile: mobileNumber,
        role: 'patient',
        bloodGroup: matchedMockUser?.bloodGroup || 'O+',
        area: matchedMockUser?.area || 'Tirunelveli',
        district: 'Tirunelveli',
        healthId: matchedMockUser?.healthId || `TVL-TN-OTP-${mobileNumber.slice(-4)}`,
        authProvider: 'Mobile OTP',
        avatar: matchedMockUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      };

      const token = generateJWT(otpUser);
      setUser(otpUser);
      setJwtToken(token);
      setDecodedClaims(decodeJWT(token));
      localStorage.setItem('tvl_user', JSON.stringify(otpUser));
      localStorage.setItem('tvl_jwt_token', token);
      toast.success(`Welcome, ${cleanName}! Signed in.`);
      return { success: true, user: otpUser, token };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (updatedData) => {
    if (!user) return null;
    const targetMobile = updatedData.mobile || user.mobile;
    const cleanName = sanitizePatientName(updatedData.name || user.name, targetMobile);
    const updatedUser = {
      ...user,
      ...updatedData,
      name: cleanName
    };
    setUser(updatedUser);
    localStorage.setItem('tvl_user', JSON.stringify(updatedUser));
    if (targetMobile && cleanName && cleanName !== 'Patient') {
      localStorage.setItem(`tvl_patient_name_${targetMobile}`, cleanName);
    }
    const token = generateJWT(updatedUser);
    setJwtToken(token);
    setDecodedClaims(decodeJWT(token));
    localStorage.setItem('tvl_jwt_token', token);
    toast.success('Patient profile updated successfully!');
    return updatedUser;
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      const registeredUser = {
        id: 'usr_reg_' + Date.now(),
        ...userData,
        role: 'patient',
        healthId: 'TVL-TN-' + Math.floor(1000 + Math.random() * 9000) + '-2024'
      };
      const token = generateJWT(registeredUser);
      setUser(registeredUser);
      setJwtToken(token);
      setDecodedClaims(decodeJWT(token));
      localStorage.setItem('tvl_user', JSON.stringify(registeredUser));
      localStorage.setItem('tvl_jwt_token', token);
      toast.success(`Account created successfully! Health ID: ${registeredUser.healthId}`);
      return { success: true, user: registeredUser, token };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('tvl_user');
    localStorage.removeItem('tvl_jwt_token');
    setUser(null);
    setJwtToken(null);
    setDecodedClaims(null);
    toast.success('Logged out successfully');
  };

  const googleLogin = async (userData = null) => {
    return loginWithOAuth('google', userData);
  };

  const loginPatient = (userData = {}) => {
    const patUser = {
      id: 'usr_pat_' + Date.now(),
      name: userData.name || 'Ramesh Kumar',
      email: userData.email || 'ramesh.kumar@example.com',
      mobile: userData.mobile || userData.phone || '9876543210',
      role: 'patient',
      bloodGroup: userData.bloodGroup || 'B+',
      area: userData.address || 'Palayamkottai, Tirunelveli',
      district: 'Tirunelveli',
      age: userData.age || 32,
      gender: userData.gender || 'Male'
    };
    return loginAsUser(patUser);
  };

  const registerPatient = (userData) => register(userData);

  const loginAdmin = (adminData = {}) => {
    return login(adminData?.email || 'admin@tvlhealth.gov.in', adminData?.password || 'admin123', 'admin');
  };

  const isPatient = Boolean(user && user.role !== 'admin');
  const patient = isPatient ? user : (user || mockUsers[0]);
  const admin = user?.role === 'admin' ? user : null;

  const value = {
    user,
    patient,
    isPatient,
    admin,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'hospital_staff' || user?.role === 'admin',
    jwtToken,
    decodedClaims,
    isAuthenticated: !!user && !!jwtToken,
    loading,
    login,
    loginAsUser,
    loginPatient,
    registerPatient,
    loginAdmin,
    googleLogin,
    loginWithOAuth,
    loginWithOTP,
    verifyOTPAndLogin,
    updateProfile,
    sanitizePatientName,
    register,
    logout,
    allUsers: mockUsers
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
