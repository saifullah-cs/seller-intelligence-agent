
"use client";

import { FormEvent, useState } from "react";

type Listing = {
  listingId: string;
  shopId: string | null;
  title: string;
  description: string;
  url: string;
  priceValue: number | null;
  priceCurrency: string | null;
  tags: string[];
  materials: string[];
  views: number | null;
  favorites: number | null;
  quantity: number | null;
  language: string | null;
  createdAt: string | null;
};

type SearchResponse = {
  success: boolean;
  keyword: string;
  totalMatchingListings: number | null;
  returnedListings: number;
  listings: Listing[];
  error?: string | { message?: string };
};

function formatPrice(
  value: number | null,
  currency: string | null
): string {
  if (value === null || !currency) return "Price unavailable";

  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

function formatNumber(value: number | null): string {
  return value === null ? "Not provided by Etsy" : value.toLocaleString();
}

function getErrorMessage(data: SearchResponse): string {
  if (typeof data.error === "string") return data.error;
  if (data.error?.message) return data.error.message;
  return "Etsy search failed. Please try again.";
}

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [searchedKeyword, setSearchedKeyword] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [totalMatching, setTotalMatching] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  async function searchEtsy(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const searchTerm = keyword.trim();

    if (!searchTerm) {
      setError("Enter a product keyword to search Etsy.");
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);
    setListings([]);
    setTotalMatching(null);

    try {
      const params = new URLSearchParams({
        keyword: searchTerm,
        limit: "10",
      });

      const response = await fetch(
        `/api/etsy-normalized?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = (await response.json()) as SearchResponse;

      if (!response.ok || !data.success) {
        throw new Error(getErrorMessage(data));
      }

      setListings(Array.isArray(data.listings) ? data.listings : []);
      setTotalMatching(
        typeof data.totalMatchingListings === "number"
          ? data.totalMatchingListings
          : null
      );
      setSearchedKeyword(searchTerm);
    } catch (err) {
      setListings([]);
      setTotalMatching(null);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to complete Etsy search."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <a href="/" className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              Marketplace Intelligence
            </p>
            <h1 className="mt-1 text-xl font-bold sm:text-2xl">
              Seller Intelligence
            </h1>
          </a>

          <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            Live Etsy Search
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <section className="rounded-3xl bg-slate-950 px-6 py-9 text-white shadow-sm sm:px-10 sm:py-12">
          <p className="text-sm font-semibold text-indigo-300">
            Product research workspace
          </p>

          <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
            Research the marketplace with live Etsy data.
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            Search product keywords, inspect listing details, and explore
            the information Etsy makes available through its API.
          </p>

          <form
            onSubmit={searchEtsy}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="product-keyword" className="sr-only">
              Product keyword
            </label>

            <input
              id="product-keyword"
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="e.g. wooden wall decor"
              maxLength={200}
              required
              disabled={loading}
              className="min-w-0 flex-1 rounded-xl border border-slate-600 bg-white px-4 py-3.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-indigo-500 px-7 py-3.5 font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Searching Etsy..." : "Search Etsy"}
            </button>
          </form>

          <p className="mt-3 text-xs leading-5 text-slate-400">
            Results are requested from Etsy when you search. Up to 10
            listings are requested per search. Matching totals are shown
            only when Etsy provides them.
          </p>
        </section>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
          >
            <p className="font-semibold">Search could not be completed</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {loading && (
          <section
            role="status"
            className="mt-8 rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center"
          >
            <p className="font-semibold">Retrieving live Etsy results</p>
            <p className="mt-2 text-sm text-slate-500">
              Waiting for the Etsy API response...
            </p>
          </section>
        )}

        {!loading && !hasSearched && (
          <section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
            <h3 className="text-lg font-semibold">Start your research</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Enter a product keyword above to retrieve current listing
              data through your Etsy API integration. No database search
              is performed when this page opens.
            </p>
          </section>
        )}

        {!loading && hasSearched && !error && (
          <>
            <section className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Listings returned</p>
                <p className="mt-2 text-3xl font-bold">
                  {listings.length}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Results in this API response
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Matching listings
                </p>
                <p className="mt-2 text-3xl font-bold">
                  {totalMatching === null
                    ? "Unavailable"
                    : totalMatching.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Total reported by Etsy, if provided
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Search keyword</p>
                <p className="mt-2 break-words text-xl font-bold">
                  {searchedKeyword}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Live search request
                </p>
              </div>
            </section>

            <section className="mt-10">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">Search results</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Listing information returned by Etsy for this search.
                  </p>
                </div>

                <span className="text-sm text-slate-500">
                  {listings.length}{" "}
                  {listings.length === 1 ? "listing" : "listings"} returned
                </span>
              </div>

              {listings.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center">
                  <h3 className="text-lg font-semibold">
                    No listings returned
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Try another keyword. An empty response does not
                    necessarily mean the marketplace has no matching items.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {listings.map((listing) => (
                    <article
                      key={listing.listingId}
                      className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                          Etsy listing
                        </span>
                        <span className="max-w-36 break-all text-right text-xs text-slate-400">
                          ID: {listing.listingId}
                        </span>
                      </div>

                      <h3 className="mt-4 text-lg font-bold leading-6">
                        {listing.title || "Untitled listing"}
                      </h3>

                      <p className="mt-3 text-2xl font-bold text-indigo-700">
                        {formatPrice(
                          listing.priceValue,
                          listing.priceCurrency
                        )}
                      </p>

                      <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm">
                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">Shop ID</span>
                          <span className="break-all text-right font-medium">
                            {listing.shopId ?? "Not provided"}
                          </span>
                        </div>

                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">Views</span>
                          <span className="text-right font-medium">
                            {formatNumber(listing.views)}
                          </span>
                        </div>

                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">Favorites</span>
                          <span className="text-right font-medium">
                            {formatNumber(listing.favorites)}
                          </span>
                        </div>

                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">Quantity</span>
                          <span className="text-right font-medium">
                            {formatNumber(listing.quantity)}
                          </span>
                        </div>

                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">Language</span>
                          <span className="text-right font-medium">
                            {listing.language ?? "Not provided"}
                          </span>
                        </div>

                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">Created</span>
                          <span className="text-right font-medium">
                            {listing.createdAt
                              ? new Date(listing.createdAt).toLocaleDateString()
                              : "Not provided"}
                          </span>
                        </div>
                      </div>

                      {listing.description && (
                        <p className="mt-4 whitespace-pre-line break-words text-sm leading-6 text-slate-600">
                          {listing.description}
                        </p>
                      )}

                      {listing.tags.length > 0 && (
                        <div className="mt-4">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Tags
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {listing.tags.slice(0, 8).map((tag, index) => (
                              <span
                                key={`${listing.listingId}-tag-${index}`}
                                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {listing.materials.length > 0 && (
                        <p className="mt-3 text-sm text-slate-600">
                          <span className="font-semibold">Materials: </span>
                          {listing.materials.join(", ")}
                        </p>
                      )}

                      <div className="mt-auto pt-5">
                        {listing.url &&
                        (() => {
                          try {
                            return new URL(listing.url).protocol === "https:";
                          } catch {
                            return false;
                          }
                        })() ? (
                          <a
                            href={listing.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                          >
                            View listing on Etsy ↗
                          </a>
                        ) : (
                          <p className="text-sm text-slate-400">
                            A valid listing URL was not provided.
                          </p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        <footer className="mt-14 border-t border-slate-200 py-6 text-center text-sm text-slate-500">
          Seller Intelligence · Marketplace Research
        </footer>
      </div>
    </main>
  );
}
