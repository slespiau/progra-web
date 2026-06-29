import Link from "next/link";

export default function PagoPendientePage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="auth-eyebrow">Pago pendiente</p>
        <h1>Tu pago quedó pendiente</h1>
        <p className="auth-intro">
          Mercado Pago todavía no confirmó la operación. Podés volver a revisar
          el estado en tus órdenes dentro de unos minutos.
        </p>

        <div className="admin-formulario-botones">
          <Link href="/ordenes" className="boton-finalizar">
            Ver mis órdenes
          </Link>
          <Link href="/productos" id="boton-vaciar">
            Volver a productos
          </Link>
        </div>
      </section>
    </main>
  );
}