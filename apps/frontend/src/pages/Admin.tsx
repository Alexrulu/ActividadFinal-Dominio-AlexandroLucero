import { useEffect, useState } from "react";
import { useBooks } from "../hooks/useBooks";
import { useToken } from "../hooks/useToken";

interface LoanData {
  id: string;
  userId: string;
  bookId: string;
  approved: boolean;
  returned: boolean;
  returnRequested?: boolean;
  from: string;
  to: string;
}

export default function Admin() {
  const [loans, setLoans] = useState<LoanData[]>([]);
  const books = useBooks().books
  const [loading, setLoading] = useState(true);

  const token = useToken();

  const fetchLoans = async () => {
    if (!token) return;
    const res = await fetch("http://localhost:3000/loans/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        requesterId: "admin1",
        requesterRole: "admin"
      })
    });
    const data = await res.json();
    setLoans(data.loans || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleApprove = async (loanId: string) => {
    await fetch("http://localhost:3000/loans/approve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ loanId })
    });
    fetchLoans(); // refrescar lista
  };

  const handleDelete = async (loanId: string) => {
    await fetch("http://localhost:3000/loans/delete", {
      method: "POST", // cambiar a POST
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ loanId })
    });
    fetchLoans(); // refrescar lista
  };

  if (loading) return <p className="p-4">Cargando préstamos...</p>;

  return (
    <div className="p-4">
      <h1>Panel de Admin</h1>
      <div className="mt-4 flex flex-col gap-4 md:grid md:grid-cols-2">

        {loans.length === 0 && <p>No hay préstamos pendientes</p>}

        {loans.map(loan => {
          const book = books.find(b => b.id === loan.bookId);
          if (!book) return null;

          return (
            <div key={loan.id} className="p-3 border border-zinc-700 rounded bg-zinc-950/50 flex justify-between items-center relative w-full">
              <div>
                <p className={loan.approved ? "text-cyan-300" : "text-zinc-400"}>
                  {loan.approved ? "Préstamo aprobado" : "Préstamo pendiente"}
                </p>
                <p>{book.title} - {book.author}</p>
                <img src={book.thumbnail} alt={book.title} className="w-[80px] md:w-[70px] absolute top-0 rounded-bl-full opacity-50 rounded right-0 -z-10" />
                <p>Desde: {new Date(loan.from).toLocaleDateString()}</p>
                <p>Hasta: {new Date(loan.to).toLocaleDateString()}</p>
              </div>
              {!loan.approved && (
                <div className="flex flex-col gap-2">
                  <button
                    className="bg-green-600 px-2 py-1 rounded"
                    onClick={() => handleApprove(loan.id)}
                  >
                    Aprobar
                  </button>
                  <button
                    className="bg-red-600 px-2 py-1 rounded"
                    onClick={() => handleDelete(loan.id)}
                  >
                    Eliminar
                  </button>
                </div>
              )}

              {loan.approved && loan.returnRequested && !loan.returned && (
                <button
                  className="bg-green-600 px-2 py-1 rounded"
                  onClick={async () => {
                    await fetch("http://localhost:3000/loans/approvereturn", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                      },
                      body: JSON.stringify({ loanId: loan.id })
                    });
                    fetchLoans(); // refrescar lista
                  }}
                >
                  Aprobar devolución
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
