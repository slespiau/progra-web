"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    async function cargarOrdenes() {
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
          setError(result.error || "No se pudieron cargar las órdenes");
          return;
        }

        setOrdenes(result.data || []);
      } catch (err) {
        setError("Error al cargar las órdenes");
      } finally {
        setLoading(false);
      }
    }

    cargarOrdenes();
  }, [router]);

  if (loading) {
    return (
      <section className="ordenes">
        <div className="ordenes-contenido">
          <p className="ordenes-loading">Cargando órdenes...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="ordenes">
      <div className="ordenes-contenido">
        <div className="ordenes-header">
          <div>
            <h2>Mis órdenes</h2>
            <p className="ordenes-intro">
              Acá podés ver el historial de tus compras realizadas.
            </p>
          </div>

          <Link href="/" className="ordenes-volver">
            Volver al inicio
          </Link>
        </div>

        {error && <p className="ordenes-error">{error}</p>}

        {!error && ordenes.length === 0 && (
          <div className="orden-vacia">
            <p>Todavía no realizaste ninguna compra.</p>
            <Link href="/productos" className="hero-boton">
              Ver productos
            </Link>
          </div>
        )}

        <div className="lista-ordenes">
          {ordenes.map((orden) => (
            <article key={orden.id} className="orden-card">
              <div className="orden-card-top">
                <div>
                  <p className="orden-fecha">
                    {new Date(orden.creado_en).toLocaleDateString("es-AR")}
                  </p>
                  <h3>Orden #{orden.id}</h3>
                </div>

                <span className={`orden-estado orden-estado-${orden.estado}`}>
                  {orden.estado}
                </span>
              </div>

              {orden.items && orden.items.length > 0 && (
                <div className="orden-items">
                  {orden.items.map((item, index) => (
                    <div key={index} className="orden-item">
                      <div>
                        <p className="orden-item-nombre">{item.nombre_producto}</p>
                        <p className="orden-item-cantidad">x{item.cantidad}</p>
                      </div>

                      <p className="orden-item-precio">
                        ${Number(item.subtotal).toLocaleString("es-AR")}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="orden-total">
                <p>
                  Total: <span>${Number(orden.total).toLocaleString("es-AR")}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}