import { Link } from "react-router-dom"
import Button from "../components/Button"
import { useToken } from "../hooks/useToken"

export default function Index() {

  const { token, userId } = useToken();

  return(
    <div className="px-[7vw] py-30 flex flex-col w-full h-[90dvh] justify-between gap-5 sm:px-40 lg:px-80">

      <div className="flex flex-col gap-4 text-center">
        <p className="text-2xl font-bold">Bienvenido a <br />Library System 😊</p>
        <p className="text-cyan-300 font-semibold">Tu biblioteca virtual</p>
        <p className="">Donde puedes solicitar el prestamo de un libro... <span className="font-bold">¡Sin Cargos! 🥹</span></p>
      </div>

      <div className="flex flex-col gap-4 items-center">
        <Button className="w-full text-xl">
          <Link to="/listbooks">Ver libros disponibles</Link>
        </Button>

        {token && userId ? (
          <Button className="w-full text-xl bg-zinc-800 border-zinc-600">
            <Link to="/main">Ir al panel</Link>
          </Button>
        ) : (
          <>
            <Button className="w-full text-xl bg-cyan-900 border-cyan-600">
            <Link to="/login">Iniciar Sesión</Link>
            </Button>
      
            <Button className="w-full text-xl bg-zinc-800 border-zinc-600">
              <Link to="/register">Registrarse</Link>
            </Button>
          </>
        )}
      </div>

    </div>
  )
}