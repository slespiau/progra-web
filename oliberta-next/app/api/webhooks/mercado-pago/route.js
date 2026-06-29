import { createClient } from "@supabase/supabase-js";
import { Payment } from "mercadopago";
import { client } from "../../../../lib/mercadopago";

function createAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

export async function POST(request) {
  try {
    const body = await request.json();

    const topic = body.type || body.topic;
    const paymentId = body.data?.id || body["data.id"];

    if (topic !== "payment" || !paymentId) {
      return Response.json({ received: true });
    }

    const payment = new Payment(client);
    const paymentData = await payment.get({ id: paymentId });

    const estadoPago = paymentData.status;
    const referencia = paymentData.external_reference;

    if (!referencia) {
      return Response.json({ received: true });
    }

    const supabase = createAdminSupabase();

    if (estadoPago === "approved") {
      const { error } = await supabase
        .from("ordenes")
        .update({
          estado: "pagado",
          metodo_pago: "mercado_pago",
          referencia_pago: String(paymentId),
          pagado_en: new Date().toISOString(),
        })
        .eq("id", Number(referencia));

      if (error) {
        console.error("Error al actualizar orden pagada:", error);
      }
    }

    if (estadoPago === "pending") {
      const { error } = await supabase
        .from("ordenes")
        .update({
          estado: "pendiente",
          metodo_pago: "mercado_pago",
          referencia_pago: String(paymentId),
        })
        .eq("id", Number(referencia));

      if (error) {
        console.error("Error al actualizar orden pendiente:", error);
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Error en webhook de Mercado Pago:", error);
    return Response.json({ received: false }, { status: 500 });
  }
}