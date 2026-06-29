"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const emailLimpio = email.trim();
      const nombreLimpio = nombre.trim();
      const apellidoLimpio = apellido.trim();

      const { data, error } = await supabase.auth.signUp({
        email: emailLimpio,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        const { error: profileError } = await supabase.from("usuarios").insert({
          id: data.user.id,
          email: emailLimpio,
          nombre: nombreLimpio,
          apellido: apellidoLimpio,
          rol: "cliente",
        });

        if (profileError) {
          setError(profileError.message);
          return;
        }
      }

      router.push("/auth/login");
    } catch (err) {
      setError("Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="auth-eyebrow">Tu cuenta Oliberta</p>
        <h1>Crear cuenta</h1>
        <p className="auth-intro">
          Registrate para guardar tus datos, comprar más fácil y consultar tus órdenes.
        </p>

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

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>

        <p className="auth-switch">
          ¿Ya tenés cuenta? <Link href="/auth/login">Iniciar sesión</Link>
        </p>
      </section>
    </main>
  );
}