import { useState } from 'react';
import { useRequestLoan } from '../hooks/useRequestLoan';

export default function RequestLoanButton({ bookId,}: { bookId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [duration, setDuration] = useState(1);

  const { requestLoan, loading, error, success } = useRequestLoan();

  return (
    <div>
      {isOpen ? (
        <div className="flex gap-2">
          <button 
            onClick={() => setIsOpen(false)}
            className='bg-zinc-800 rounded-lg py-1 px-2 text-sm border-1 border-zinc-500'
            >❌</button>
          <select 
            value={duration} onChange={e => setDuration(Number(e.target.value))}
            className='bg-zinc-800 rounded-lg py-1 text-sm border-1 border-zinc-500'
            >
            <option value={1}>1 mes</option>
            <option value={2}>2 meses</option>
          </select>
          <button 
            onClick={() => requestLoan(bookId, duration)} disabled={loading}
            className='bg-green-800 rounded-lg py-1 px-2 text-sm border-1 border-green-500'
            >
              ✅
          </button>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className='bg-cyan-700 rounded-lg py-1 px-2 text-sm border-1 border-cyan-500'
          >Solicitar Préstamo</button>
      )}

      {error && <p className="text-red-400 truncate text-xs py-1">{error}</p>}
      {success && <p className="text-green-400 truncate text-xs py-1">{success}</p>}

    </div>
  );
}
