import Link from "next/link";

export default function PagoFallidoPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="auth-eyebrow">Pago no realizado</p>
        <h1>No se pudo completar el pago</h1>
        <p className="auth-intro">
          La operación no fue aprobada. Podés volver a intentarlo desde tu
          sección de órdenes.
        </p>

        <div className="admin-formulario-botones">
          <Link href="/ordenes" className="boton-finalizar">
            Volver a mis órdenes
          </Link>
          <Link href="/productos" id="boton-vaciar">
            Seguir viendo productos
          </Link>
        </div>
      </section>
    </main>
  );
}