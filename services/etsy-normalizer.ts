import type {
  EtsyListing,
  NormalizedEtsyListing,
} from "@/types/etsy";

export function normalizeEtsyListing(
  listing: EtsyListing
): NormalizedEtsyListing {
  const price = listing.price;
  const validPrice =
    price &&
    Number.isFinite(price.amount) &&
    Number.isFinite(price.divisor) &&
    price.divisor > 0;

  const timestamp = listing.creation_timestamp;
  const validTimestamp =
    typeof timestamp === "number" &&
    Number.isFinite(timestamp) &&
    timestamp > 0;

  return {
    listingId: String(listing.listing_id),
    shopId:
      listing.shop_id != null
        ? String(listing.shop_id)
        : null,
    title: listing.title ?? "",
    description: listing.description ?? "",
    url: listing.url ?? "",
    priceValue: validPrice
      ? price.amount / price.divisor
      : null,
    priceCurrency: validPrice
      ? price.currency_code
      : null,
    tags: Array.isArray(listing.tags)
      ? listing.tags
      : [],
    materials: Array.isArray(listing.materials)
      ? listing.materials
      : [],
    views:
      typeof listing.views === "number"
        ? listing.views
        : null,
    favorites:
      typeof listing.num_favorers === "number"
        ? listing.num_favorers
        : null,
    quantity:
      typeof listing.quantity === "number"
        ? listing.quantity
        : null,
    language: listing.language ?? null,
    createdAt: validTimestamp
      ? new Date(timestamp * 1000).toISOString()
      : null,
  };
}

export function normalizeEtsyListings(
  listings: EtsyListing[]
): NormalizedEtsyListing[] {
  return listings.map(normalizeEtsyListing);
}