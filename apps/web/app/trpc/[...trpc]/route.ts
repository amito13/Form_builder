import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

// Forwards requests server-side so the auth cookie stays first-party on the browser's origin.
async function proxy(req: NextRequest) {
  const url = new URL(req.url);
  const targetUrl = `${API_URL}${url.pathname}${url.search}`;

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("content-length");

  const response = await fetch(targetUrl, {
    method: req.method,
    headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : await req.text(),
  });

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

export { proxy as GET, proxy as POST };
