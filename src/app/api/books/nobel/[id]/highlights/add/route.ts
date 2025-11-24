import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const loginData = {
      email: "api@test.com",
      password: "test123",
    };

    const loginResponse = await fetch("https://api.nobelyayin.com/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const loginResult = await loginResponse.json();

    const token = loginResult.token || loginResult.access_token || loginResult.accessToken;

    if (!token) {
      throw new Error("No token received from login");
    }

    const { id } = await params;
    const { cfi, text, type, color } = await request.json();

    const addHighlightResponse = await fetch(`https://api.nobelyayin.com/books/${id}/highlights`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cfi, text, type, color }),
    });

    if (!addHighlightResponse.ok) {
      throw new Error(`Failed to add highlight: ${addHighlightResponse.status}`);
    }

    const newHighlight = await addHighlightResponse.json();
    return NextResponse.json(newHighlight);
  } catch (error) {
    console.error("Nobel API error:", error);
    return NextResponse.json(
      {
        message: "Failed to add highlight to Nobel API",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
