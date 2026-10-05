type ListingCorrection = {
  phone?: string;
};

const CORRECTIONS_BY_PLACE_ID: Readonly<Record<string, ListingCorrection>> = {
  // Vintage Rose Hairdressing Studio, Orlando, Florida.
  ChIJYfqE4uV554gRsd49WVY84sA: { phone: "+1 407-604-1275" },
};

export function applyListingCorrection<T extends { place_id?: string | null }>(
  listing: T,
): T {
  const correction = listing.place_id
    ? CORRECTIONS_BY_PLACE_ID[listing.place_id]
    : undefined;

  return correction ? { ...listing, ...correction } : listing;
}
