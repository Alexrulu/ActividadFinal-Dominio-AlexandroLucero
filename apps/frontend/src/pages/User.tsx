import { useEffect, useState } from "react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function User() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:3000/users/list", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`
  }
})

      .then(res => res.json())
      .then(data => {
        // El backend devuelve { users: [...] }
        if (data.users && data.users.length > 0) {
          setUser(data.users[0]);
        }
      })
      .catch(err => console.error("Error fetching user:", err));
  }, []);

  if (!user) return <p className="p-4">Cargando usuario...</p>;

  return (
    <div className="p-4">
      <p>Información del usuario</p>
      <p>Nombre: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Rol: {user.role}</p>
    </div>
  );
}
