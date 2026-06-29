"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Credenciales inválidas");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Iniciar sesión</h1>

        <form onSubmit={handleLogin}>
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

          <button type="submit">Ingresar</button>
        </form>

        {error && (
          <p>
            {error}. Si todavía no tenés cuenta,{" "}
            <Link href="/auth/register">registrate acá</Link>.
          </p>
        )}

        {!error && (
          <p>
            ¿No tenés cuenta? <Link href="/auth/register">Registrate</Link>
          </p>
        )}
      </section>
    </main>
  );
}