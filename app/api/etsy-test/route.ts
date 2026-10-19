
import { NextResponse } from "next/server";

export async function GET() {
  const keystring = process.env.ETSY_API_KEY;
  const sharedSecret = process.env.ETSY_SHARED_SECRET;

  if (!keystring || !sharedSecret) {
    return NextResponse.json(
      { success: false, error: "Etsy credentials are missing from .env.local" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      "https://openapi.etsy.com/v3/application/openapi-ping",
      {
        headers: {
          "x-api-key": `${keystring}:${sharedSecret}`,
        },
        cache: "no-store",
      }
    );

    const responseText = await response.text();

    return NextResponse.json(
      {
        success: response.ok,
        etsyStatus: response.status,
        result: responseText ? JSON.parse(responseText) : null,
      },
      { status: response.ok ? 200 : response.status }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Could not connect to the Etsy API." },
      { status: 502 }
    );
  }
}
