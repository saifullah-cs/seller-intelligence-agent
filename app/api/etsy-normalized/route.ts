import { NextRequest, NextResponse } from "next/server";
import type { EtsyListing } from "@/types/etsy";
import { normalizeEtsyListings } from "@/services/etsy-normalizer";

export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams
    .get("keyword")
    ?.trim();

  if (!keyword) {
    return NextResponse.json(
      {
        success: false,
        error: "Please provide a keyword.",
        example: "/api/etsy-normalized?keyword=wooden%20wall%20decor",
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

  const keystring = process.env.ETSY_API_KEY;
  const sharedSecret = process.env.ETSY_SHARED_SECRET;

  if (!keystring || !sharedSecret) {
    return NextResponse.json(
      { success: false, error: "Etsy credentials are missing." },
      { status: 500 }
    );
  }

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

    const data: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          etsyStatus: response.status,
          error: data,
        },
        { status: response.status }
      );
    }

    const results =
      typeof data === "object" &&
      data !== null &&
      "results" in data &&
      Array.isArray(data.results)
        ? (data.results as EtsyListing[])
        : [];

    const normalizedListings = normalizeEtsyListings(results);

    return NextResponse.json({
      success: true,
      keyword,
      totalMatchingListings:
        typeof data === "object" &&
        data !== null &&
        "count" in data &&
        typeof data.count === "number"
          ? data.count
          : null,
      returnedListings: normalizedListings.length,
      listings: normalizedListings,
    });
  } catch (error) {
    console.error("Etsy normalization test failed:", error);

    return NextResponse.json(
      { success: false, error: "Could not retrieve Etsy listings." },
      { status: 502 }
    );
  }
}