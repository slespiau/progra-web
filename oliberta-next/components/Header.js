import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div className="marca">
        <h1>OLIBERTA</h1>
      </div>

      <nav className="nav">
        <Link href="/">Inicio</Link>
        <Link href="/nosotros">Nosotros</Link>
        <Link href="/productos">Productos</Link>
        <Link href="/contacto">Contacto</Link>
        <Link href="/carrito">Carrito</Link>
      </nav>
    </header>
  );
}

  