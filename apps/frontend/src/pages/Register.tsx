import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al registrar usuario');
      }

      navigate('/login');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-[7vw] py-30 flex flex-col w-full h-[80dvh] justify-between gap-5 sm:px-40 lg:px-80">
      <div className="flex flex-col gap-4 text-center">
        <p className="text-2xl font-bold">Registrar nuevo usuario</p>
        <p className="text-cyan-300 font-semibold">¡Crea tu cuenta para acceder a la biblioteca!</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Nombre:</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            className="w-full p-2 border rounded border-zinc-600 outline-none" 
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            className="w-full p-2 border rounded border-zinc-600 outline-none" 
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">Contraseña:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            required 
            className="w-full p-2 border rounded border-zinc-600 outline-none" 
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-cyan-700 rounded-lg py-1 px-2 text-xl border-1 border-cyan-500 w-full"
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      {error && <p className="text-red-400 mt-2">{error}</p>}
    </div>
  );
}
