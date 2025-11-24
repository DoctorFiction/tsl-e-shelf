import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string; bookmarkId: string }> }) {
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

    const { id, bookmarkId } = await params;

    const deleteResponse = await fetch(`https://api.nobelyayin.com/books/${id}/bookmarks/${bookmarkId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!deleteResponse.ok) {
      throw new Error(`Failed to delete bookmark: ${deleteResponse.status}`);
    }

    return NextResponse.json({ message: "Bookmark deleted successfully" });
  } catch (error) {
    console.error("Nobel API error:", error);
    return NextResponse.json(
      {
        message: "Failed to delete bookmark from Nobel API",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
