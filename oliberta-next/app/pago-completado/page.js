import Link from "next/link";

export default function PagoCompletadoPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="auth-eyebrow">Pago confirmado</p>
        <h1>Tu pago se realizó con éxito</h1>
        <p className="auth-intro">
          Recibimos la confirmación de Mercado Pago. Podés revisar el estado
          actualizado en tu sección de órdenes.
        </p>

        <div className="admin-formulario-botones">
          <Link href="/ordenes" className="boton-finalizar">
            Ver mis órdenes
          </Link>
          <Link href="/productos" id="boton-vaciar">
            Seguir comprando
          </Link>
        </div>
      </section>
    </main>
  );
}