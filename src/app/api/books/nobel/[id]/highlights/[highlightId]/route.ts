import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; highlightId: string }> },
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

    const { id, highlightId } = await params;
    const { color } = await request.json();

    const updateResponse = await fetch(
      `https://api.nobelyayin.com/books/${id}/highlights/${highlightId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ color }),
      },
    );

    if (!updateResponse.ok) {
      throw new Error(`Failed to update highlight: ${updateResponse.status}`);
    }

    const updatedHighlight = await updateResponse.json();
    return NextResponse.json(updatedHighlight);
  } catch (error) {
    console.error("Nobel API error:", error);
    return NextResponse.json(
      {
        message: "Failed to update highlight in Nobel API",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; highlightId: string }> },
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

    const { id, highlightId } = await params;

    const deleteResponse = await fetch(
      `https://api.nobelyayin.com/books/${id}/highlights/${highlightId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!deleteResponse.ok) {
      throw new Error(`Failed to delete highlight: ${deleteResponse.status}`);
    }

    return NextResponse.json({ message: "Highlight deleted successfully" });
  } catch (error) {
    console.error("Nobel API error:", error);
    return NextResponse.json(
      {
        message: "Failed to delete highlight from Nobel API",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
