import { NextResponse } from "next/server";

export async function POST() {
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

    const booksResponse = await fetch("https://api.nobelyayin.com/books", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!booksResponse.ok) {
      throw new Error(`Failed to fetch books: ${booksResponse.status}`);
    }

    const books = await booksResponse.json();
    return NextResponse.json(books);
  } catch (error) {
    console.error("Nobel API error:", error);
    return NextResponse.json({ message: "Failed to fetch books from Nobel API", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
