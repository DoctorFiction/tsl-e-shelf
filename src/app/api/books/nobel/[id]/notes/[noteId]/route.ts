import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string; noteId: string }> }) {
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

    const { id, noteId } = await params;
    const { note } = await request.json();

    const updateResponse = await fetch(`https://api.nobelyayin.com/books/${id}/notes/${noteId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ note }),
    });

    if (!updateResponse.ok) {
      throw new Error(`Failed to update note: ${updateResponse.status}`);
    }

    const updatedNote = await updateResponse.json();
    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error("Nobel API error:", error);
    return NextResponse.json(
      {
        message: "Failed to update note in Nobel API",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string; noteId: string }> }) {
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

    const { id, noteId } = await params;

    const deleteResponse = await fetch(`https://api.nobelyayin.com/books/${id}/notes/${noteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!deleteResponse.ok) {
      throw new Error(`Failed to delete note: ${deleteResponse.status}`);
    }

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Nobel API error:", error);
    return NextResponse.json(
      {
        message: "Failed to delete note from Nobel API",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
