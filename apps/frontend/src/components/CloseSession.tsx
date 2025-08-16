import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CloseIcon() {
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
      className="lucide lucide-power-icon lucide-power text-red-400/70"
    >
      <path d="M12 2v10"/>
      <path d="M18.4 6.6a9 9 0 1 1-12.77.04"/>
    </svg>
  );
}

export default function CloseSession() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.dispatchEvent(new Event('authChange'));
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <>
      <button
        className={`flex gap-2 p-1.5 border border-zinc-700 rounded-lg duration-200 ${isOpen ? 'bg-red-950' : 'bg-zinc-800'}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <CloseIcon />
        {isOpen && (
          <button onClick={handleLogout} className="w-full text-center border-1 rounded-sm px-1 border-zinc-700 bg-zinc-800">
            Cerrar Sesión
          </button>
      )}
      </button>

      
    </>
  );
}
