import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-contenido">
        <div className="footer-col footer-marca">
          <h3>OLIBERTA</h3>
          <p>
            Velas artesanales creadas para llenar cada espacio de calma,
            calidez y armonía.
          </p>
        </div>

        <div className="footer-col">
          <h4>Navegación</h4>
          <div className="footer-links">
            <Link href="/">Inicio</Link>
            <Link href="/nosotros">Nosotros</Link>
            <Link href="/productos">Productos</Link>
            <Link href="/contacto">Contacto</Link>
            <Link href="/carrito">Carrito</Link>
          </div>
        </div>

        <div className="footer-col">
          <h4>Contacto</h4>
          <p>
            Email:{" "}
            <a href="mailto:contacto@oliberta.com">contacto@oliberta.com</a>
          </p>
          <p>
            Instagram:{" "}
            <a
              href="https://instagram.com/oli_berta.tienda"
              target="_blank"
              rel="noopener noreferrer"
            >
              @oli_berta.tienda
            </a>
          </p>
          <p>San Miguel del Monte</p>
          <p>Provincia de Buenos Aires</p>
        </div>
      </div>

      <div className="footer-copy">
        <p>© 2026 Oliberta. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}