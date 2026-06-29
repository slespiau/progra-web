"use client";

import { useState } from "react";

export default function Contacto() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setExito("");

    if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(email)) {
      setError("Ingresá un email válido.");
      return;
    }

    if (mensaje.trim().length < 10) {
      setError("El mensaje debe tener al menos 10 caracteres.");
      return;
    }

    setEnviando(true);

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim(),
          mensaje: mensaje.trim(),
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setError(result.error || "No se pudo enviar el mensaje.");
        return;
      }

      setExito("Mensaje enviado con éxito.");
      setNombre("");
      setEmail("");
      setMensaje("");
    } catch (err) {
      setError("Ocurrió un error al enviar el mensaje.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section id="contacto" className="contacto">
      <div className="contacto-contenido">
        <h2>Contacto</h2>
        <p>
          Si querés comunicarte con Oliberta, hacer un pedido especial o
          consultar por regalos, podés escribirnos y con gusto te ayudamos.
        </p>

        <p className="contacto-dato">
          Email: <a href="mailto:contacto@oliberta.com">contacto@oliberta.com</a>
        </p>

        <p className="contacto-dato">
          Instagram:{" "}
          <a
            href="https://instagram.com/oli_berta.tienda"
            target="_blank"
            rel="noopener noreferrer"
          >
            @oli_berta.tienda
          </a>
        </p>

        <form className="contacto-formulario" onSubmit={handleSubmit}>
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
            <label htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows="5"
              required
            />
          </div>

          {error && <p className="contacto-error">{error}</p>}
          {exito && <p className="contacto-exito">{exito}</p>}

          <button type="submit" disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar mensaje"}
          </button>
        </form>
      </div>
    </section>
  );
}