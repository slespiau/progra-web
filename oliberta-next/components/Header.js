import Link from "next/link";
import UserSession from "./UserSession";

export default function Header() {
  return (
    <header className="header">
      <div className="marca">
        <Link href="/" className="marca-link">
          <h1>OLIBERTA</h1>
        </Link>
      </div>

      <nav className="nav">
        <Link href="/">Inicio</Link>
        <Link href="/nosotros">Nosotros</Link>
        <Link href="/productos">Productos</Link>
        <Link href="/contacto">Contacto</Link>
        <Link href="/carrito" className="nav-carrito">
          <svg
            className="nav-carrito-icono"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M3 5H5L7 15H17L19 8H8"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="9" cy="19" r="1.4" fill="currentColor" />
            <circle cx="17" cy="19" r="1.4" fill="currentColor" />
          </svg>
          <span>Carrito</span>
        </Link>
      </nav>

      <UserSession />
    </header>
  );
}