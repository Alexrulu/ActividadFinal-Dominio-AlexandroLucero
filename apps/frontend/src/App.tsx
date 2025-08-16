import { Routes, Route} from 'react-router-dom'
import './styles/App.css'
import Index from './pages/Index'
import Login from './pages/Login'
import Register from './pages/Register'
import Header from './layout/Header'
import Main from './layout/Main'
import ListBooks from './pages/ListBooks'
import User from './pages/User'
import Admin from './pages/Admin'

export default function App() {

  return (
    <>
      <Header />
      
      <Routes>
        <Route path="/" element={<Index />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/main" element={<Main />}/>
        <Route path="/user" element={<User />}/>
        <Route path="/listbooks" element={<ListBooks />}/>
        <Route path="/admin" element={<Admin />}/>
      </Routes>
    </>
  )
}

