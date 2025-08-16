import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useLoans } from './useLoans';
import type { Loan } from '../../../../domain/src/entities/Loan';

describe('useLoans hook', () => {
  const mockLoan: Loan = {
    id: '1',
    bookId: 'b1',
    userId: 'u1',
    from: new Date(),
    to: new Date(),
    returned: false,
    approved: false,
  };

  beforeEach(() => {
    vi.restoreAllMocks();

    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => 'mock-token'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });
  });

  it('should fetch loan successfully', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ loans: [mockLoan] }),
      })
    ));

    const { result } = renderHook(() => useLoans('u1'));

    await waitFor(() => {
      expect(result.current.loan).toEqual(mockLoan);
      expect(result.current.loading).toBe(false);
    });
  });

  it('should return null if no loans found', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ loans: [] }),
      })
    ));

    const { result } = renderHook(() => useLoans('u1'));

    await waitFor(() => {
      expect(result.current.loan).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle fetch error gracefully', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('Fetch error'))));

    const { result } = renderHook(() => useLoans('u1'));

    await waitFor(() => {
      expect(result.current.loan).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  it('should do nothing if userId is null', async () => {
    const { result } = renderHook(() => useLoans(null));

    expect(result.current.loan).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it('should refresh loan when calling refreshLoan', async () => {
    const newLoan: Loan = { ...mockLoan, id: '2' };

    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ json: () => Promise.resolve({ loans: [mockLoan] }) })
      .mockResolvedValueOnce({ json: () => Promise.resolve({ loans: [newLoan] }) });

    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useLoans('u1'));

    await waitFor(() => {
      expect(result.current.loan).toEqual(mockLoan);
      expect(result.current.loading).toBe(false);
    });

    result.current.refreshLoan();

    await waitFor(() => {
      expect(result.current.loan).toEqual(newLoan);
      expect(result.current.loading).toBe(false);
    });
  });
});
