import type { Book } from '@domain/entities/Book';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const BookService = {
  async list(): Promise<Book[]> {
    const res = await fetch(`${API_URL}/books/list`);
    if (!res.ok) throw new Error('Error al obtener libros');
    const data = await res.json();
    return data.books || [];
  }
};
