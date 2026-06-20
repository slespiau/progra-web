"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Checkout() {
  const [orden, setOrden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");
  const [preferencia, setPreferencia] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const ordenId = searchParams.get("orden");

  useEffect(() => {
    async function cargarOrden() {
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
          setError("No se pudo cargar la orden");
          return;
        }

        const ordenEncontrada = result.data.find(
          (item) => String(item.id) === String(ordenId)
        );

        if (!ordenEncontrada) {
          setError("Orden no encontrada");
          return;
        }

        setOrden(ordenEncontrada);
      } catch (err) {
        setError("Error al cargar checkout");
      } finally {
        setLoading(false);
      }
    }

    if (!ordenId) {
      setError("No se indicó una orden");
      setLoading(false);
      return;
    }

    cargarOrden();
  }, [ordenId, router]);

  const handlePrepararPago = async () => {
    setProcesando(true);
    setError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth/login");
        return;
      }

      const res = await fetch("/api/pagos/crear-preferencia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          orden_id: Number(ordenId),
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setError(result.error || "Error al preparar el pago");
        return;
      }

      setPreferencia(result.data);
    } catch (err) {
      setError("Error al preparar el pago");
    } finally {
      setProcesando(false);
    }
  };

  if (loading) {
    return (
      <section className="checkout">
        <div className="checkout-contenido">
          <p>Cargando checkout...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout">
      <div className="checkout-contenido">
        <h2>Checkout</h2>
        <p className="checkout-intro">
          Revisá tu orden y prepará el siguiente paso para el pago.
        </p>

        {error && <p className="checkout-error">{error}</p>}

        {orden && (
          <div className="checkout-box">
            <p>
              <strong>Orden #{orden.id}</strong>
            </p>
            <p>Estado: {orden.estado}</p>
            <p>Total: ${Number(orden.total).toLocaleString("es-AR")}</p>

            <div className="checkout-metodos">
              <h3>Método de pago</h3>
              <p>Mercado Pago estará habilitado en el próximo paso del proyecto.</p>
            </div>

            <button
              className="boton-finalizar"
              onClick={handlePrepararPago}
              disabled={procesando}
            >
              {procesando ? "Preparando..." : "Preparar pago"}
            </button>

            {preferencia && (
              <div className="checkout-preferencia">
                <h3>Preferencia preparada</h3>
                <p>Orden: #{preferencia.orden_id}</p>
                <p>Total: ${Number(preferencia.total).toLocaleString("es-AR")}</p>
                <p>Email: {preferencia.payer_email}</p>
                <p>Referencia externa: {preferencia.external_reference}</p>
                <p>Ítems: {preferencia.items.length}</p>
              </div>
            )}

            <Link href="/ordenes" className="checkout-volver">
              Volver a mis órdenes
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}