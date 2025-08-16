import { useState, useEffect, useCallback } from 'react';
import type { Book } from '../../../../domain/src/entities/Book';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = useCallback(() => {
    setLoading(true);
    fetch(`http://localhost:3000/books/list`)
      .then(res => res.json())
      .then(data => {
        setBooks(data.books || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return { books, loading };
}
