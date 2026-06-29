"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function AgregarAlCarrito({ producto }) {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAgregar = async () => {
    setLoading(true);
    setMensaje("");
    setError("");

    try {
      if (!producto?.id) {
        setError("Producto inválido");
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth/login");
        return;
      }

      const res = await fetch("/api/carrito", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          producto_id: producto.id,
          cantidad: 1,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setError(result.error || "Error al agregar al carrito");
        return;
      }

      setMensaje("Producto agregado al carrito");
    } catch (err) {
      console.error("Error inesperado:", err);
      setError("Error al agregar al carrito");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="agregar-carrito">
      <button
        type="button"
        className="producto-boton"
        onClick={handleAgregar}
        disabled={loading}
      >
        {loading ? "Agregando..." : "Agregar al carrito"}
      </button>

      {mensaje && <p className="agregar-mensaje">{mensaje}</p>}
      {error && <p className="agregar-error">{error}</p>}
    </div>
  );
}