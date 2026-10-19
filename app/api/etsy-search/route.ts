
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const keystring = process.env.ETSY_API_KEY;
  const sharedSecret = process.env.ETSY_SHARED_SECRET;

  if (!keystring || !sharedSecret) {
    return NextResponse.json(
      { success: false, error: "Etsy credentials are missing." },
      { status: 500 }
    );
  }

  const keyword = request.nextUrl.searchParams.get("keyword")?.trim();

  if (!keyword) {
    return NextResponse.json(
      {
        success: false,
        error: "Please provide a keyword.",
        example: "/api/etsy-search?keyword=wooden%20wall%20decor",
      },
      { status: 400 }
    );
  }

  const limitParam = Number(
    request.nextUrl.searchParams.get("limit") ?? "10"
  );
  const limit = Number.isFinite(limitParam)
    ? Math.min(100, Math.max(1, Math.floor(limitParam)))
    : 10;

  try {
    const url = new URL(
      "https://openapi.etsy.com/v3/application/listings/active"
    );

    url.searchParams.set("keywords", keyword);
    url.searchParams.set("limit", String(limit));

    const response = await fetch(url.toString(), {
      headers: {
        "x-api-key": `${keystring}:${sharedSecret}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const responseText = await response.text();

    let data: unknown;
    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch {
      data = { message: responseText };
    }

    if (!response.ok) {
      console.error("Etsy search failed:", response.status, data);

      return NextResponse.json(
        {
          success: false,
          etsyStatus: response.status,
          error: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      keyword,
      etsyStatus: response.status,
      data,
    });
  } catch (error) {
    console.error("Etsy connection error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Could not connect to Etsy.",
      },
      { status: 502 }
    );
  }
}