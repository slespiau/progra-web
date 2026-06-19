export async function GET() {
    try {
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/productos?select=*`;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
      const res = await fetch(url, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        return Response.json(
          {
            success: false,
            error: data.message || "Error al obtener productos",
          },
          { status: res.status }
        );
      }
  
      return Response.json({
        success: true,
        data,
      });
    } catch (err) {
      return Response.json(
        {
          success: false,
          error: "Error al obtener productos",
        },
        { status: 500 }
      );
    }
  }