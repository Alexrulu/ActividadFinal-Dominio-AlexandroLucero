import { useEffect, useState } from 'react';

type Book = {
  id: string;
  title: string;
  author: string;
  totalCopies: number;
  borrowedCopies: number;
  thumbnail?: string;
};

export default function ListBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/books/list")
      .then(res => res.json())
      .then(data => {
        setBooks(data.books);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  return(
    <div>
      <h1>Libros</h1>
      <ul>
        {books.map(book => (
          <li key={book.id}>
            {book.title}
            <img src={book.thumbnail} alt={book.title} />
          </li>
        ))}
      </ul>
    </div>
  )
}