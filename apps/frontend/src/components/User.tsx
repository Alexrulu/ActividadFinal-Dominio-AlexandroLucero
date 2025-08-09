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

export default function User() {
  return(
    <button className="p-1 bg-zinc-800 border-1 border-zinc-700 rounded-full">
      <UserIcon/>
    </button>
    
  )
}