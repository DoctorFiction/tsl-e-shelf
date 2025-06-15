// app/api/book/route.ts
// FACING A CORS ISSUE WHEN CALLING THE BOOK URL FROM THE CLIENT
// BROWSER BLOCKS THE REQUEST BC SERVER DOES NOT INCLUDE OUR DOMAIN (localhost:3000) IN THE Acess=Control-Allow-Origin HEADER
// SO, FETCH THE FILE ON BACKEND, AND LET CLIENT GET THE DATA/CONTENT

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return new Response(JSON.stringify({ error: "Missing URL" }), {
      status: 400,
    });
  }

  try {
    const response = await fetch(url);
    const contentType = response.headers.get("content-type") || "text/plain";
    const body = await response.text();

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.warn("DEBUGPRINT[38]: route.ts:25: err=", err);
    return new Response(JSON.stringify({ error: "Failed to fetch content" }), {
      status: 500,
    });
  }
}
