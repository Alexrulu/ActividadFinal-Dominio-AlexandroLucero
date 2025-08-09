import Search from '../components/Search'
import BarsMenu from '../components/BarsMenu'

export default function Header() {
  return (
    <header className="text-white p-3 flex justify-between w-full border-b-1 border-zinc-700">
        <img src="/favicon.svg" className="w-10 " />
        <div className='flex items-center gap-3'>
          <Search/>
          <BarsMenu/>
        </div>
    </header>
  )
}