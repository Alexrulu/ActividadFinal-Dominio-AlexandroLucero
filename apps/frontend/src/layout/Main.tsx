import NewLoan from '../components/NewLoan'
import User from '../components/User'
import ListBooks from '../pages/ListBooks'

export default function Main() {
  return(
    <main className="text-white">

      <div className="border-b-1 border-zinc-700 px-3.5 py-2 flex justify-between items-center">
        <h1>Library System</h1>
        <User/>
      </div>

      <div className="px-3.5 py-4">
        <div className='flex justify-between'>
          <p>Sección de prestamo</p>
          <NewLoan />
        </div>

      
      </div>

      <div>
        <ListBooks />
      </div>
      
    </main>
  )
}