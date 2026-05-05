import { NextRequest } from 'next/server';

export interface JWTPayload {
  email: string;
  role: 'admin';
  uid?: string;
  user_id?: string;
}

// In a real production app with Firebase, you'd use firebase-admin:
// import admin from 'firebase-admin';
// await admin.auth().verifyIdToken(token)

export function verifyToken(token: string): JWTPayload | null {
  try {
    // Temporary fallback: decode the Firebase ID token without signature verification.
    // NOTE: This assumes the token structure matches a Firebase JWT token.
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const decoded = JSON.parse(jsonPayload);
    
    if (decoded && (decoded.uid || decoded.user_id)) {
      return { email: decoded.email || 'admin', role: 'admin', uid: decoded.uid || decoded.user_id };
    }
    return null;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export function authenticateRequest(req: NextRequest): JWTPayload | null {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyToken(token);
}
