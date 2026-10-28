// A narrow proxy for Cinemeta-compatible metadata only.
// Never turn this into an arbitrary URL proxy: that can create SSRF/open-proxy risks.
const ORIGIN = "https://v3-cinemeta.strem.io";
const ALLOWED = new Set(["catalog", "meta"]);

export async function onRequest({ request }) {
  const url = new URL(request.url);
  if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });
  const resource = url.searchParams.get("resource") || "catalog";
  const type = url.searchParams.get("type") || "movie";
  const id = url.searchParams.get("id") || "top";
  if (!ALLOWED.has(resource) || !["movie", "series"].includes(type)) {
    return Response.json({ error: "Unsupported metadata request" }, { status: 400 });
  }
  if (!/^[a-zA-Z0-9._-]{1,100}$/.test(id)) {
    return Response.json({ error: "Invalid catalog or metadata id" }, { status: 400 });
  }
  const upstream = `${ORIGIN}/${resource}/${encodeURIComponent(type)}/${encodeURIComponent(id)}.json`;
  try {
    const response = await fetch(upstream, {
      headers: { "Accept": "application/json", "User-Agent": "RaahimFlix-PWA/0.1" }
    });
    const headers = new Headers({
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "X-Content-Type-Options": "nosniff"
    });
    if (!response.ok) return new Response(JSON.stringify({ error: "Metadata provider returned an error" }), { status: 502, headers });
    return new Response(await response.text(), { status: 200, headers });
  } catch {
    return Response.json({ error: "Metadata provider unavailable" }, { status: 502 });
  }
}
