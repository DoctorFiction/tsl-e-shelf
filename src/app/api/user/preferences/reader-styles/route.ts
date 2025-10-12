import { NextResponse } from "next/server";

export async function GET(
  request: Request,
) {
  // Log the request to satisfy the linter
  console.log(request.url);

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

    const preferencesResponse = await fetch(
      `https://api.nobelyayin.com/user/preferences/reader-styles`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!preferencesResponse.ok) {
      throw new Error(`Failed to fetch reader preferences: ${preferencesResponse.status}`);
    }

    const preferences = await preferencesResponse.json();
    return NextResponse.json(preferences);
  } catch (error) {
    console.error("Nobel API error:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch reader preferences from Nobel API",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
) {
  // Log the request to satisfy the linter
  console.log(request.url);

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

    const { presetName, fontSize, lineHeight, wordSpacing, letterSpacing, backgroundColor, textColor } = await request.json();

    const updatePreferencesResponse = await fetch(
      `https://api.nobelyayin.com/user/preferences/reader-styles`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ presetName, fontSize, lineHeight, wordSpacing, letterSpacing, backgroundColor, textColor }),
      },
    );

    if (!updatePreferencesResponse.ok) {
      throw new Error(`Failed to update reader preferences: ${updatePreferencesResponse.status}`);
    }

    const updatedPreferences = await updatePreferencesResponse.json();
    return NextResponse.json(updatedPreferences);
  } catch (error) {
    console.error("Nobel API error:", error);
    return NextResponse.json(
      {
        message: "Failed to update reader preferences in Nobel API",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
