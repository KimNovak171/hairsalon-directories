type ListingCorrection = {
  name?: string;
  address?: string;
  phone?: string;
  website?: string;
  tagline?: string;
};

const CORRECTIONS_BY_PLACE_ID: Readonly<Record<string, ListingCorrection>> = {
  // Vintage Rose Hairdressing Studio, Orlando, Florida.
  ChIJYfqE4uV554gRsd49WVY84sA: { phone: "+1 407-604-1275" },
  // Salon Yeager at The Gallery, Knoxville, Tennessee.
  ChIJ_8U44KglXIgRQhzwxDO1PHo: {
    name: "Salon Yeager at The Gallery",
    phone: "+1 865-281-3241",
  },
  // Royal Touch Beauty Salon, Vacaville, California.
  ChIJB93xGVY9hYARtjo19555Vyo: { phone: "+1 510-932-1886" },
  // Sashko Hair Studio, Elgin, Illinois.
  ChIJHyoSsYdpD4gRuWNC23fnGlc: {
    name: "Sashko Hair Studio",
    address: "556 Congdon Ave, Elgin, IL 60120",
  },
  // Hair by Jessie Shaw, Enfield, Connecticut.
  ChIJrRAy5ufl5okRcgJj6gGQnEk: {
    address:
      "662 Enfield St (inside Mane Habitat Hair Club), Enfield, CT 06082",
    website: "https://www.hairbyjessieshaw.com/",
  },
};

export function applyListingCorrection<T extends { place_id?: string | null }>(
  listing: T,
): T {
  const correction = listing.place_id
    ? CORRECTIONS_BY_PLACE_ID[listing.place_id]
    : undefined;

  return correction ? { ...listing, ...correction } : listing;
}
