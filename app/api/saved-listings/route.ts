import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.");
}

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(connectionString),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword")?.trim() ?? "";

    const listings = await prisma.etsyListing.findMany({
      where: keyword
        ? {
            title: {
              contains: keyword,
            },
          }
        : undefined,
      orderBy: {
        fetchedAt: "desc",
      },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (error) {
    console.error("Saved listings error:", error);

    return NextResponse.json(
      { success: false, error: "Could not retrieve saved listings." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}