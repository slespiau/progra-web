import { createClient } from "@supabase/supabase-js";
import { client, Preference } from "../../../../lib/mercadopago";

function errorResponse(error, status) {
  return Response.json({ success: false, error }, { status });
}

function createSupabaseFromToken(token) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return errorResponse("No autenticado", 401);
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = createSupabaseFromToken(token);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return errorResponse("No autenticado", 401);
    }

    const body = await request.json();
    const { orden_id } = body;

    if (!orden_id) {
      return errorResponse("Orden inválida", 400);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

    if (!appUrl) {
      return errorResponse("Falta configurar NEXT_PUBLIC_APP_URL", 500);
    }

    const { data: orden, error: ordenError } = await supabase
      .from("ordenes")
      .select("id, usuario_id, total, estado")
      .eq("id", orden_id)
      .eq("usuario_id", user.id)
      .single();

    if (ordenError || !orden) {
      return errorResponse("Orden no encontrada", 404);
    }

    if (orden.estado !== "pendiente") {
      return errorResponse("La orden no está disponible para pago", 400);
    }

    const { data: items, error: itemsError } = await supabase
      .from("orden_items")
      .select("producto_id, nombre_producto, cantidad, precio_unitario, subtotal")
      .eq("orden_id", orden.id);

    if (itemsError || !items || items.length === 0) {
      return errorResponse("La orden no tiene ítems válidos", 400);
    }

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: items.map((item) => ({
          id: String(item.producto_id),
          title: item.nombre_producto,
          description: `Cantidad: ${item.cantidad}`,
          quantity: item.cantidad,
          unit_price: Number(item.precio_unitario),
          currency_id: "ARS",
        })),
        back_urls: {
          success: `${appUrl}/pago-completado`,
          failure: `${appUrl}/pago-fallido`,
          pending: `${appUrl}/pago-pendiente`,
        },
        auto_return: "approved",
        external_reference: String(orden.id),
        notification_url: `${appUrl}/api/webhooks/mercado-pago`,
      },
    });

    return Response.json({
      success: true,
      data: {
        orden_id: orden.id,
        init_point: response.init_point,
        sandbox_init_point: response.sandbox_init_point,
      },
    });
  } catch (err) {
    console.error("Error al crear preferencia:", err);

    return errorResponse(
      err?.message || "Error al crear preferencia de pago",
      err?.status || 500
    );
  }
}