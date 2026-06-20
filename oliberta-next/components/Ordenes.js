"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getOrdenes() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/auth/login");
          return;
        }

        const res = await fetch("/api/ordenes", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
          console.error(result.error);
          setOrdenes([]);
          return;
        }

        setOrdenes(result.data || []);
      } catch (err) {
        console.error("Error al obtener órdenes:", err);
        setOrdenes([]);
      } finally {
        setLoading(false);
      }
    }

    getOrdenes();
  }, []);

  return (
    <section className="ordenes">
      <div className="ordenes-contenido">
        <h2>Mis órdenes</h2>
        <p className="ordenes-intro">
          Acá podés ver el historial de tus compras realizadas.
        </p>

        <div className="ordenes-box">
          {loading ? (
            <p className="ordenes-vacio">Cargando órdenes...</p>
          ) : ordenes.length === 0 ? (
            <div>
              <p className="ordenes-vacio">Todavía no tenés órdenes creadas.</p>
              <Link href="/productos" className="hero-boton">
                Ir al catálogo
              </Link>
            </div>
          ) : (
            ordenes.map((orden) => (
              <div key={orden.id} className="orden-card">
                <p>
                  <strong>Orden #{orden.id}</strong>
                </p>
                <p>Total: ${Number(orden.total).toLocaleString("es-AR")}</p>
                <p>Estado: {orden.estado}</p>
                <p>
                  Fecha:{" "}
                  {new Date(orden.creado_en).toLocaleDateString("es-AR")}
                </p>
                <Link
                  href={`/checkout?orden=${orden.id}`}
                  className="checkout-volver"
                >
                  Ir al checkout
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}