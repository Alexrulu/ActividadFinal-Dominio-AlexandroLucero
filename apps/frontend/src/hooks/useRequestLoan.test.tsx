import { renderHook, act, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useRequestLoan } from './useRequestLoan';
import type { Loan } from '@domain/entities/Loan';

// ---- Mock useNavigate a nivel superior ----
const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual: any = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

interface LoanResponse extends Loan {
  message: string;
  durationInMonths: number;
}

describe('useRequestLoan hook', () => {
  const mockLoan: LoanResponse = {
    id: '1',
    bookId: 'b1',
    userId: 'u1',
    from: new Date(),
    to: new Date(),
    returned: false,
    approved: true,
    message: 'Préstamo exitoso',
    durationInMonths: 2,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    navigateMock.mockClear();

    // Mock localStorage
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => 'mock-token'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });
  });

  it('should redirect if no token is found', async () => {
    (localStorage.getItem as any).mockReturnValueOnce(null);

    const { result } = renderHook(() => useRequestLoan());

    await act(async () => {
      await result.current.requestLoan('b1', 1);
    });

    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  it('should handle successful loan request', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockLoan),
      })
    ));

    const { result } = renderHook(() => useRequestLoan());

    await act(async () => {
      await result.current.requestLoan('b1', 2);
    });

    await waitFor(() => {
      expect(result.current.success).toBe('Préstamo exitoso');
      expect(result.current.loanInfo).toEqual(mockLoan);
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  it('should call onLoanRequested callback if provided', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockLoan),
      })
    ));

    const onLoanRequested = vi.fn();
    const { result } = renderHook(() => useRequestLoan());

    await act(async () => {
      await result.current.requestLoan('b1', 2, onLoanRequested);
    });

    expect(onLoanRequested).toHaveBeenCalled();
  });

  it('should handle server error response', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Error del servidor' }),
      })
    ));

    const { result } = renderHook(() => useRequestLoan());

    await act(async () => {
      await result.current.requestLoan('b1', 1);
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Error del servidor');
      expect(result.current.success).toBeNull();
      expect(result.current.loanInfo).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle network error', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('Network error'))));

    const { result } = renderHook(() => useRequestLoan());

    await act(async () => {
      await result.current.requestLoan('b1', 1);
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Network error');
      expect(result.current.success).toBeNull();
      expect(result.current.loanInfo).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });
});
