import Productos from "../../components/Productos";
import { productos } from "../../data/productos";

export default function ProductosPage() {
  return (
    <main>
      <Productos productos={productos} />
    </main>
  );
}
