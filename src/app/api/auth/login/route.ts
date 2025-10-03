import { NextResponse } from "next/server";

export async function POST() {
  try {
    const loginData = {
      email: "api@test.com",
      password: "test123",
    };

    const response = await fetch("https://api.nobelyayin.com/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Login failed", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
