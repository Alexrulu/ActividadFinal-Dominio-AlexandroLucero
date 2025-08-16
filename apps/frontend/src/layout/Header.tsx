import { Link } from 'react-router-dom';
import CloseSession from '../components/CloseSession';
import Button from '../components/Button';
import { useToken } from '../hooks/useToken';

function HomeIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="lucide lucide-house-icon lucide-house text-zinc-300"
    >
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    </svg>
  );
}

function LibraryIcon() {
  return (
      <svg xmlns="http://www.w3.org/2000/svg" 
      width="24"
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="1" 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      className="lucide lucide-library-big-icon lucide-library-big text-zinc-300"
    >
      <rect width="8" height="18" x="3" y="3" rx="1"/>
      <path d="M7 3v18"/>
      <path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z"/>
    </svg>
  )
}

export default function Header() {
  const { token, userId } = useToken();

  return (
    <header className="text-white p-3 flex justify-between w-full border-b border-zinc-700 sticky top-0 bg-zinc-900">
      <div className="flex items-center gap-3">
        <img src="/favicon.svg" className="w-10" alt="Logo" />
        {token ? (
          <>
            <Link to="/main" className="bg-zinc-800 p-1.5 rounded-lg border border-zinc-700">
              <HomeIcon />
            </Link>
            <Link to="/listbooks" className="bg-zinc-800 p-1.5 rounded-lg border border-zinc-700">
              <LibraryIcon />
            </Link>
          </>
        ) : (
          <Link to="/" className="bg-zinc-800 p-1.5 rounded-lg border border-zinc-700">
            <HomeIcon />
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3">

        {token && userId === 'admin1' && (
          <Button className="h-full bg-zinc-800 border border-zinc-700">
            <Link className='p-2 text-cyan-200' to="/admin">Admin</Link>
          </Button>
        )}

        {token && userId ? (
          <CloseSession />
        ) : (
          null
        )}
      </div>
    </header>
  );
}
