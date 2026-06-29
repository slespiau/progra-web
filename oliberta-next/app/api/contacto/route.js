export async function POST(request) {
  try {
    const body = await request.json();
    const nombre = body.nombre?.trim();
    const email = body.email?.trim();
    const mensaje = body.mensaje?.trim();

    if (!nombre || !email || !mensaje) {
      return Response.json(
        { success: false, error: "Todos los campos son obligatorios." },
        { status: 400 }
      );
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(email)) {
      return Response.json(
        { success: false, error: "Email inválido." },
        { status: 400 }
      );
    }

    if (mensaje.length < 10) {
      return Response.json(
        { success: false, error: "El mensaje es demasiado corto." },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      message: "Mensaje recibido correctamente.",
    });
  } catch (error) {
    return Response.json(
      { success: false, error: "Error al procesar el formulario." },
      { status: 500 }
    );
  }
}