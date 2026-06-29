"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setMensaje("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("usuarios").insert({
        id: data.user.id,
        nombre,
        apellido,
        email,
        rol: "cliente",
      });

      if (profileError) {
        setError("Usuario creado, pero hubo un problema al guardar el perfil");
        return;
      }
    }

    setMensaje("Cuenta creada con éxito. Ahora podés iniciar sesión.");

    setTimeout(() => {
      router.push("/auth/login");
    }, 1500);
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Crear cuenta</h1>

        <form onSubmit={handleRegister}>
          <div>
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="apellido">Apellido</label>
            <input
              id="apellido"
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Crear cuenta</button>
        </form>

        {error && <p>{error}</p>}
        {mensaje && <p>{mensaje}</p>}

        <p>
          ¿Ya tenés cuenta? <Link href="/auth/login">Iniciá sesión</Link>
        </p>
      </section>
    </main>
  );
}