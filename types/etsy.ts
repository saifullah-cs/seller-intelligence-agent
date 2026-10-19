export type EtsyPrice = {
  amount: number;
  divisor: number;
  currency_code: string;
};

export type EtsyListing = {
  listing_id: number;
  shop_id?: number;
  title: string;
  description?: string;
  url: string;
  price?: EtsyPrice;
  tags?: string[];
  materials?: string[];
  num_favorers?: number;
  views?: number;
  quantity?: number;
  creation_timestamp?: number;
  language?: string;
};

export type NormalizedEtsyListing = {
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