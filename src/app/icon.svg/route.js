import { theme } from "../../config/theme";

export const dynamic = "force-static";

export function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="${theme.background}"/><text x="32" y="43" font-family="Arial,sans-serif" font-size="32" font-weight="bold" text-anchor="middle" fill="${theme.primary}">AQ</text></svg>`;
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } });
}
