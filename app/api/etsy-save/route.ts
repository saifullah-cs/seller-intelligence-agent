import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.");
}

const adapter = new PrismaMariaDb(connectionString);
const prisma = new PrismaClient({ adapter });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const keyword = String(body.keyword ?? "").trim();

    if (!keyword) {
      return NextResponse.json(
        { success: false, error: "Please provide a keyword." },
        { status: 400 }
      );
    }

    const apiKey = process.env.ETSY_API_KEY;
    const sharedSecret = process.env.ETSY_SHARED_SECRET;

    if (!apiKey || !sharedSecret) {
      return NextResponse.json(
        { success: false, error: "Etsy API credentials are not configured." },
        { status: 500 }
      );
    }

    const url = new URL(
      "https://openapi.etsy.com/v3/application/listings/active"
    );

    url.searchParams.set("keywords", keyword);
    url.searchParams.set("limit", "10");

    const etsyResponse = await fetch(url.toString(), {
      headers: {
        "x-api-key": `${apiKey}:${sharedSecret}`,
      },
      cache: "no-store",
    });

    if (!etsyResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Etsy API request failed.",
          etsyStatus: etsyResponse.status,
        },
        { status: 502 }
      );
    }

    const data = await etsyResponse.json();
    const listings = Array.isArray(data.results) ? data.results : [];

    let saved = 0;
    let failed = 0;

    for (const listing of listings) {
      try {
        const price = listing.price;
        const priceValue =
          price?.amount != null && price?.divisor
            ? Number(price.amount) / Number(price.divisor)
            : null;

        await prisma.etsyListing.upsert({
          where: {
            listingId: String(listing.listing_id),
          },
          create: {
            listingId: String(listing.listing_id),
            shopId:
              listing.shop_id != null ? String(listing.shop_id) : null,
            title: String(listing.title ?? "Untitled listing"),
            description: listing.description ?? null,
            url: listing.url ?? null,
            priceValue,
            priceCurrency: price?.currency_code ?? null,
            tags: Array.isArray(listing.tags) ? listing.tags : undefined,
            materials: Array.isArray(listing.materials)
              ? listing.materials
              : undefined,
            views: listing.views ?? null,
            favorites: listing.num_favorers ?? null,
            quantity: listing.quantity ?? null,
            language: listing.language ?? null,
            listingCreatedAt:
              listing.created_timestamp != null
                ? String(listing.created_timestamp)
                : null,
          },
          update: {
            shopId:
              listing.shop_id != null ? String(listing.shop_id) : null,
            title: String(listing.title ?? "Untitled listing"),
            description: listing.description ?? null,
            url: listing.url ?? null,
            priceValue,
            priceCurrency: price?.currency_code ?? null,
            tags: Array.isArray(listing.tags) ? listing.tags : undefined,
            materials: Array.isArray(listing.materials)
              ? listing.materials
              : undefined,
            views: listing.views ?? null,
            favorites: listing.num_favorers ?? null,
            quantity: listing.quantity ?? null,
            language: listing.language ?? null,
            listingCreatedAt:
              listing.created_timestamp != null
                ? String(listing.created_timestamp)
                : null,
          },
        });

        saved++;
            } catch (error) {
        failed++;

        console.error(
          `Failed to save listing ${listing.listing_id}:`,
          error
        );
      }
    }

    return NextResponse.json({
      success: true,
      keyword,
      fetched: listings.length,
      saved,
      failed,
      totalMatchingListings: data.count ?? null,
    });
  } catch (error) {
    console.error("Etsy save error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch or save Etsy listings." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}