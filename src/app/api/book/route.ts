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
    console.log("Fetching EPUB from URL:", url);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "application/epub+zip";
    console.log("Original content-type:", contentType);

    const arrayBuffer = await response.arrayBuffer();
    console.log("Fetched EPUB size:", arrayBuffer.byteLength);

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
        "Content-Length": arrayBuffer.byteLength.toString(),
      },
    });
  } catch (err) {
    console.error("Error fetching EPUB:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: "Failed to fetch content", details: errorMessage }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
