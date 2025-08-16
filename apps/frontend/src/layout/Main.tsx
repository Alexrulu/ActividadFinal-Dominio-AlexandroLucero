import { Link } from 'react-router-dom';
import NewLoan from '../components/NewLoan';
import { useLoans } from '../hooks/useLoans';
import { useBooks } from '../hooks/useBooks';
import { useToken } from '../hooks/useToken';

function UserIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="1" 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      className="lucide lucide-user-icon lucide-user text-zinc-400">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

export default function Main() {
  const books = useBooks().books;
  const { token, userId } = useToken();
  const { loan, refreshLoan, loading } = useLoans(userId)

  if (loading) return <p className="text-white p-4">Cargando préstamo...</p>;

  const loanBook = loan ? books.find(b => b.id === loan.bookId) : null;

  async function handleReturnLoan(loanId: string, token: string | null, refreshLoan: () => void) {
    try {
      await fetch("http://localhost:3000/loans/return", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ loanId })
      });
      refreshLoan();
    } catch (error) {
      console.error("Error al devolver el préstamo:", error);
    }
  }

  return (
    <main className="text-white">
      <div className="border-b border-zinc-700 px-3.5 py-2 flex justify-between items-center">
        <h1>Library System</h1>
        <Link to="/user" className="bg-zinc-800 p-1.5 rounded-full border border-zinc-700 translate-x-[2px]">
          <UserIcon />
        </Link>
      </div>

      <p className='p-4 font-semibold'>Sección de préstamo</p>

      <div className="flex flex-col px-3.5 py-4 gap-4">

        {loan && loanBook ? (
          <div className='flex flex-col gap-3 bg-zinc-950/50 rounded-lg p-3 border border-zinc-700 sm:mr-[10dvw] md:mr-[30dvw] lg:mr-[50dvw]'>
            <p className={loan.approved ? "text-cyan-300 font-semibold" : "text-zinc-400"}>
              {loan.approved ? "Préstamo activo:" : "Solicitud de préstamo en espera:"}
            </p>
            <div className="flex gap-4 items-center">
              <img src={loanBook.thumbnail} alt={loanBook.title} className='w-24 h-32 object-cover rounded-sm' />
              <div className='flex flex-col'>
                <h3 className='font-bold'>{loanBook.title}</h3>
                <p className='text-white/80'>{loanBook.author}</p>
                <p className="text-sm text-zinc-400">
                  Fecha de préstamo: {new Date(loan.from).toLocaleDateString()}
                </p>
                <p className="text-sm text-zinc-400">
                  Fecha de devolución: {new Date(loan.to).toLocaleDateString()}
                </p>
              </div>
            </div>

            {!loan.returned && loan.approved && !loan.returnRequested && (
              <button
                className="bg-cyan-600 px-2 py-1 rounded mt-2 font-semibold"
                onClick={() => handleReturnLoan(loan.id, token, refreshLoan)}
              >
                Solicitar devolución
              </button>
            )}
        
            {loan.returnRequested && (
              <p className="text-zinc-400 mt-2">Devolución solicitada, pendiente de aprobación del admin</p>
            )}
            
          </div>
        ) : (
          <>
            <p className="text-zinc-400">No tienes préstamos activos</p>
            <Link to="/ListBooks">
              <NewLoan />
            </Link>
          </>
        )}

      </div>
    </main>
  );
}
