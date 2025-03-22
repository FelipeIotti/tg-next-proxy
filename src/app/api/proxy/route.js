// /src/app/api/proxy/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");


  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const decodedUrl = decodeURIComponent(url);
    const body = await req.json();

    const response = await fetch(decodedUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const resBody = await response.text();

    return new Response(resBody, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "text/plain",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Proxy POST failed", message: err.message },
      { status: 500 }
    );
  }
}
