/**
 * Google Identity Services & OAuth 2.0 Utility
 * Handles Google Account Chooser popup, native GIS token client,
 * Google profile extraction, and local system accounts cache.
 */

const STORAGE_CLIENT_ID_KEY = 'tvl_google_client_id';
const STORAGE_SAVED_ACCOUNTS_KEY = 'tvl_saved_google_accounts';

/**
 * Get active Google Client ID from Vite environment or localStorage override
 */
export const getGoogleClientId = () => {
  const envId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (envId && envId.trim().length > 0 && !envId.includes('YOUR_GOOGLE_CLIENT_ID')) {
    return envId.trim();
  }
  const localId = localStorage.getItem(STORAGE_CLIENT_ID_KEY);
  return localId ? localId.trim() : '';
};

/**
 * Save Google Client ID locally for testing/production runtime
 */
export const saveGoogleClientId = (clientId) => {
  if (!clientId) {
    localStorage.removeItem(STORAGE_CLIENT_ID_KEY);
  } else {
    localStorage.setItem(STORAGE_CLIENT_ID_KEY, clientId.trim());
  }
};

/**
 * Dynamically ensure Google Identity Services script is loaded
 */
export const loadGoogleScript = () => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.google?.accounts?.oauth2) {
      return resolve(window.google);
    }

    // Check if already in DOM
    const existingScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google));
      existingScript.addEventListener('error', (err) => reject(err));
      // In case it already loaded
      if (window.google?.accounts) return resolve(window.google);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = (err) => reject(new Error('Failed to load Google Identity Services SDK'));
    document.head.appendChild(script);
  });
};

/**
 * Triggers Google's Native Account Chooser popup.
 * prompt: 'select_account' forces Google to show ALL Google accounts signed into this browser.
 */
export const triggerGoogleNativePicker = async ({ clientId, onSuccess, onError }) => {
  try {
    const activeClientId = clientId || getGoogleClientId();
    if (!activeClientId) {
      throw new Error('NO_CLIENT_ID');
    }

    await loadGoogleScript();

    if (!window.google?.accounts?.oauth2) {
      throw new Error('Google Identity Services SDK not available');
    }

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: activeClientId,
      scope: 'openid email profile https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
      prompt: 'select_account',
      callback: async (tokenResponse) => {
        if (tokenResponse.error) {
          console.error('Google OAuth error:', tokenResponse);
          if (onError) onError(new Error(tokenResponse.error_description || tokenResponse.error));
          return;
        }

        try {
          // Fetch authenticated user profile directly from Google
          const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`
            }
          });

          if (!res.ok) {
            throw new Error(`Google profile fetch failed with HTTP ${res.status}`);
          }

          const profile = await res.json();
          // Normalize profile payload
          const normalizedUser = {
            id: 'usr_g_' + (profile.sub ? profile.sub.slice(-8) : Date.now()),
            googleId: profile.sub,
            name: profile.name || `${profile.given_name || ''} ${profile.family_name || ''}`.trim() || 'Google User',
            email: profile.email,
            avatar: profile.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'G')}&background=0284c7&color=fff`,
            emailVerified: profile.email_verified ?? true,
            authProvider: 'Google OAuth 2.0',
            accessToken: tokenResponse.access_token
          };

          // Save to local system accounts list for seamless re-selection
          saveGoogleAccount(normalizedUser);

          if (onSuccess) onSuccess(normalizedUser);
        } catch (fetchErr) {
          console.error('Failed to parse Google userinfo:', fetchErr);
          if (onError) onError(fetchErr);
        }
      }
    });

    // Launch popup with explicit prompt to show all browser accounts
    tokenClient.requestAccessToken({ prompt: 'select_account' });
  } catch (err) {
    if (onError) onError(err);
    else throw err;
  }
};

/**
 * Get previously connected / recognized Google accounts on this browser
 */
export const getSavedGoogleAccounts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_SAVED_ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * Save / update account in local system accounts
 */
export const saveGoogleAccount = (account) => {
  if (!account || !account.email) return;
  try {
    const existing = getSavedGoogleAccounts().filter(a => a.email.toLowerCase() !== account.email.toLowerCase());
    const updated = [
      {
        name: account.name || account.email.split('@')[0],
        email: account.email,
        avatar: account.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(account.name || 'G')}&background=0284c7&color=fff`,
        lastUsed: new Date().toISOString()
      },
      ...existing
    ].slice(0, 5); // Keep up to 5 recent accounts
    localStorage.setItem(STORAGE_SAVED_ACCOUNTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save Google account', e);
  }
};

/**
 * Remove an account from saved accounts list
 */
export const removeSavedGoogleAccount = (email) => {
  try {
    const remaining = getSavedGoogleAccounts().filter(a => a.email.toLowerCase() !== email.toLowerCase());
    localStorage.setItem(STORAGE_SAVED_ACCOUNTS_KEY, JSON.stringify(remaining));
  } catch (e) {
    console.error('Failed to remove Google account', e);
  }
};
