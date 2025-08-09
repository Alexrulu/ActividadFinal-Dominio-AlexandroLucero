function BarsMenuIcon() {
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
      className="lucide lucide-menu-icon lucide-menu text-zinc-200"
    >
      <path d="M4 12h16" />
      <path d="M4 18h16" />
      <path d="M4 6h16" />
    </svg>
  );
}

export default function BarsMenu() {
  return(
    <button className="p-1.5 bg-zinc-800 border-1 border-zinc-700 rounded-lg">
      <BarsMenuIcon/>
    </button>
    
  )
}