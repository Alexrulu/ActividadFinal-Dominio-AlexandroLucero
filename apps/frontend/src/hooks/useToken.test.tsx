import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useToken } from './useToken';

function createJwt(payload: object) {
  const base64UrlEncode = (obj: object) =>
    btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `header.${base64UrlEncode(payload)}.signature`;
}

describe('useToken hook', () => {
  const userId = 'user-123';
  const validToken = createJwt({ userId });

  beforeEach(() => {
    vi.restoreAllMocks();

    // Mock localStorage
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => validToken),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });
  });

  it('should read token from localStorage initially', () => {
    const { result } = renderHook(() => useToken());

    expect(localStorage.getItem).toHaveBeenCalledWith('token');
    expect(result.current.token).toBe(validToken);
  });

  it('should decode userId from token and save to localStorage', () => {
    const { result } = renderHook(() => useToken());

    expect(result.current.userId).toBe(userId);
    expect(localStorage.setItem).toHaveBeenCalledWith('userId', userId);
  });

  it('should return undefined userId for invalid token', () => {
    (localStorage.getItem as any).mockReturnValueOnce('invalid.token');

    const { result } = renderHook(() => useToken());

    expect(result.current.userId).toBeUndefined();
  });

  it('should update token on storage event', () => {
    const { result } = renderHook(() => useToken());

    const newToken = createJwt({ userId: 'new-user' });
    (localStorage.getItem as any).mockReturnValue(newToken);

    act(() => {
      window.dispatchEvent(new StorageEvent('storage'));
    });

    expect(result.current.token).toBe(newToken);
    expect(result.current.userId).toBe('new-user');
  });

  it('should update token on authChange event', () => {
    const { result } = renderHook(() => useToken());

    const newToken = createJwt({ userId: 'auth-user' });
    (localStorage.getItem as any).mockReturnValue(newToken);

    act(() => {
      window.dispatchEvent(new Event('authChange'));
    });

    expect(result.current.token).toBe(newToken);
    expect(result.current.userId).toBe('auth-user');
  });
});
