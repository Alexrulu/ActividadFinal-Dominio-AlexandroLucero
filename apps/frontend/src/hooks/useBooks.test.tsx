import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useBooks } from './useBooks';
import type { Book } from '@domain/entities/Book';
import { BookService } from '../api/bookService';

describe('useBooks hook', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch books and set state', async () => {
    const mockBooks: Book[] = [
      { id: '1', title: 'Book 1', author: 'Author 1', thumbnail: '', totalCopies: 1, borrowedCopies: 0 },
    ];

    vi.spyOn(BookService, 'list').mockResolvedValueOnce(mockBooks);

    const { result } = renderHook(() => useBooks());

    await waitFor(() => expect(result.current.books).toEqual(mockBooks));

    expect(result.current.loading).toBe(false);
  });

  it('should handle fetch error', async () => {
    vi.spyOn(BookService, 'list').mockRejectedValueOnce(new Error('Error fetching books'));

    const { result } = renderHook(() => useBooks());

    await waitFor(() => expect(result.current.error).toBe('Error fetching books'));

    expect(result.current.loading).toBe(false);
  });
});
