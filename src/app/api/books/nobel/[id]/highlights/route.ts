import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
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

    const token =
      loginResult.token || loginResult.access_token || loginResult.accessToken;

    if (!token) {
      throw new Error("No token received from login");
    }

    const { id } = params;

    const highlightsResponse = await fetch(
      `https://api.nobelyayin.com/books/${id}/highlights`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!highlightsResponse.ok) {
      throw new Error(`Failed to fetch highlights: ${highlightsResponse.status}`);
    }

    const highlights = await highlightsResponse.json();
    return NextResponse.json(highlights);
  } catch (error) {
    console.error("Nobel API error:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch highlights from Nobel API",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
