import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/metadata?n=Nombre&p=Proyecto&d=Fecha
 * Devuelve el JSON de metadata del certificado NFT.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const nombre = searchParams.get("n") ?? "Certificado";
  const proyecto = searchParams.get("p") ?? "Proyecto";
  const fecha = searchParams.get("d") ?? new Date().toISOString().split("T")[0];

  // Usar URL pública para que la wallet pueda cargar la imagen (evita localhost)
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || request.nextUrl.origin;
  const imageParams = new URLSearchParams({
    n: nombre,
    p: proyecto,
    d: fecha,
  });
  const imageUrl = `${baseUrl}/api/certificate-image?${imageParams.toString()}`;

  const metadata = {
    name: `Certificado - ${proyecto}`,
    description: `Certificado acreditando la participación de ${nombre} en el proyecto ${proyecto}.`,
    image: imageUrl,
    external_url: baseUrl,
    attributes: [
      { trait_type: "Nombre", value: nombre },
      { trait_type: "Proyecto", value: proyecto },
      { trait_type: "Fecha", value: fecha },
      { trait_type: "Tipo", value: "Certificado" },
    ],
    properties: {
      category: "certificate",
    },
  };

  return NextResponse.json(metadata, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
