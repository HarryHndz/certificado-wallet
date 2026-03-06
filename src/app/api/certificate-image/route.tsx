import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const nombre = searchParams.get("n") ?? "Certificado";
  const proyecto = searchParams.get("p") ?? "Proyecto";
  const fecha = searchParams.get("d") ?? new Date().toISOString().split("T")[0];

  // Fondo con gradiente: ImageResponse/Satori a veces devuelve negro con backgroundImage
  // en data URL (base64 muy largo). Gradiente + texto siempre se ve bien.
  // (Satori a veces no renderiza bien backgroundImage con base64 muy largo)
  const bgGradient =
    "linear-gradient(135deg, #1e3a5f 0%, #1e293b 30%, #0f172a 60%, #312e81 100%)";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: bgGradient,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            maxWidth: 800,
            textAlign: "center",
            padding: 48,
          }}
        >
          <span
            style={{
              fontSize: 42,
              fontWeight: 700,
              color: "white",
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              letterSpacing: "0.05em",
            }}
          >
            CERTIFICADO
          </span>
          <span
            style={{
              fontSize: 28,
              color: "rgba(255,255,255,0.95)",
              textShadow: "0 1px 4px rgba(0,0,0,0.4)",
            }}
          >
            Se certifica que
          </span>
          <span
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: "#fbbf24",
              textShadow: "0 2px 6px rgba(0,0,0,0.5)",
            }}
          >
            {nombre}
          </span>
          <span
            style={{
              fontSize: 26,
              color: "rgba(255,255,255,0.9)",
              textShadow: "0 1px 4px rgba(0,0,0,0.4)",
            }}
          >
            participó en el proyecto
          </span>
          <span
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: "#a5b4fc",
              textShadow: "0 2px 6px rgba(0,0,0,0.5)",
            }}
          >
            {proyecto}
          </span>
          <span
            style={{
              fontSize: 22,
              color: "rgba(255,255,255,0.9)",
              marginTop: 16,
              textShadow: "0 1px 3px rgba(0,0,0,0.4)",
            }}
          >
            Fecha: {fecha}
          </span>
        </div>
      </div>
    ),
    {
      width: 1024,
      height: 1024,
    }
  );
}
