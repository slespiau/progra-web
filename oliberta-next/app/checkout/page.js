import { Suspense } from "react";
import Checkout from "../../components/Checkout";

export default function CheckoutPage() {
  return (
    <main>
      <Suspense fallback={<p>Cargando checkout...</p>}>
        <Checkout />
      </Suspense>
    </main>
  );
}