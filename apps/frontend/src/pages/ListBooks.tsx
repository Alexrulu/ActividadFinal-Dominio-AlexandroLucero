import RequestLoanButton from '../components/RequestLoan';
import { useToken } from '../hooks/useToken';
import { useBooks } from '../hooks/useBooks';

export default function ListBooks() {
  const { token, userId } = useToken();
  const { books, loading } = useBooks();

  if (loading) return <p className="text-zinc-300 text-xl text-right p-4">Cargando...</p>;
  
  return (
    <div className='p-4'>
      <h2 className='text-xl mb-5'>Libros disponibles</h2>

      {books.length !== 0 ? (
        <ul className='grid grid-cols-1 gap-6 w-full sm:grid-cols-2 lg:grid-cols-3'>
          {books.map(book => {
            const availableCopies = book.totalCopies - book.borrowedCopies;

            return (
              <li
                key={book.id}
                className='h-[25dvh] flex justify-between gap-5 w-full bg-zinc-950/50 rounded-lg p-3 border-1 border-zinc-700'
              >
                <img src={book.thumbnail} alt={book.title} className='w-1/3 rounded-sm object-cover' />
                <div className='flex flex-col w-2/3 justify-between px-4 gap-2 '>
                  <h3 className='font-bold line-clamp-2'>{book.title}</h3>
                  <p className='text-white/80 line-clamp-2'>{book.author}</p>
                  <p className='text-white/80 text-sm'>
                    Disponible: {availableCopies}
                  </p>
                  {(token && userId) && (
                    <RequestLoanButton bookId={book.id}  />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className='text-center text-white/70 mt-4'>No hay libros disponibles</div>
      )}
    </div>
  );
}
