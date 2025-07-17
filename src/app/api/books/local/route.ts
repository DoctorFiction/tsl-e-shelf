import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const booksDir = path.join(process.cwd(), "public", "books");
    const filenames = fs
      .readdirSync(booksDir)
      .filter((name) => name.endsWith(".epub"));

    const books = filenames.map((filename) => ({
      filename,
      title: decodeURIComponent(
        filename.replace(/\.epub$/, "").replace(/[_-]/g, " "),
      ),
      id: encodeURIComponent(filename), // Use this as the [id] param
    }));

    return NextResponse.json(books);
  } catch (error) {
    console.error("Error reading local books:", error);
    return NextResponse.json({ message: "Failed to load books." }, { status: 500 });
  }
}
