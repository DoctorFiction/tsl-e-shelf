import { NextResponse } from "next/server";
import { getLocalBooks } from "@/lib/local-books";

export async function GET() {
  try {
    const books = await getLocalBooks();
    return NextResponse.json(books);
  } catch (error) {
    console.error("Error reading local books:", error);
    return NextResponse.json({ message: "Failed to load books." }, { status: 500 });
  }
}
