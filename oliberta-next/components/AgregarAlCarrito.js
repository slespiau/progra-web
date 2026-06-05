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
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data: existente, error: errorBusqueda } = await supabase
        .from("carrito")
        .select("id, cantidad")
        .eq("usuario_id", user.id)
        .eq("producto_id", producto.id)
        .maybeSingle();

      if (errorBusqueda) {
        console.error("Error al buscar producto en carrito:", errorBusqueda.message);
        alert("Error al agregar al carrito");
        return;
      }

      if (existente) {
        const { error: errorUpdate } = await supabase
          .from("carrito")
          .update({ cantidad: existente.cantidad + 1 })
          .eq("id", existente.id);

        if (errorUpdate) {
          console.error("Error al actualizar carrito:", errorUpdate.message);
          alert("Error al agregar al carrito");
          return;
        }
      } else {
        const { error: errorInsert } = await supabase.from("carrito").insert({
          usuario_id: user.id,
          producto_id: producto.id,
          cantidad: 1,
        });

        if (errorInsert) {
          console.error("Error al insertar en carrito:", errorInsert.message);
          alert("Error al agregar al carrito");
          return;
        }
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