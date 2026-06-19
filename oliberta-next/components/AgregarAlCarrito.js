"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function AgregarAlCarrito({ producto }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAgregar = async () => {
    setLoading(true);

    try {
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
        alert(result.error || "Error al agregar al carrito");
        return;
      }

      alert("Producto agregado al carrito");
    } catch (err) {
      console.error("Error inesperado:", err);
      alert("Error al agregar al carrito");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className="producto-boton" onClick={handleAgregar} disabled={loading}>
      {loading ? "Agregando..." : "Agregar al carrito"}
    </button>
  );
}