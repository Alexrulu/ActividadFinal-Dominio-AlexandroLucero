import { useState, useEffect, useMemo } from 'react';

export function useToken() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    const onStorage = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const onAuthChange = () => setToken(localStorage.getItem('token'));
    window.addEventListener('authChange', onAuthChange);
    return () => window.removeEventListener('authChange', onAuthChange);
  }, []);

  const userId = useMemo(() => {
    if (!token) return undefined;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem('userId', payload.userId);
      return payload.userId;
    } catch {
      return undefined;
    }
  }, [token]);

  return { token, userId };
}
