/**
 * Publieke basis-URL van de site (geen trailing slash).
 * Zet NEXT_PUBLIC_SITE_URL in .env (bijv. https://www.autogarageviorel.nl) voor alle omgevingen.
 * Fallback: productiedomein (o.a. voor admin-deelteksten vanaf localhost).
 */
export function getPublicSiteBase(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "")
  if (fromEnv) return fromEnv
  return "https://www.autogarageviorel.nl"
}

export function getOccasionPublicUrl(carId: number): string {
  return `${getPublicSiteBase()}/occasions/${carId}`
}
