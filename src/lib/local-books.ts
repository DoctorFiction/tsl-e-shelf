import fs from "fs";
import path from "path";

export interface LocalBook {
  filename: string;
  title: string;
  id: string;
}

export async function getLocalBooks(): Promise<LocalBook[]> {
  try {
    const booksDir = path.join(process.cwd(), "public", "books");
    const filenames = fs.readdirSync(booksDir).filter((name) => name.endsWith(".epub"));

    const books = filenames.map((filename) => ({
      filename,
      title: decodeURIComponent(filename.replace(/\.epub$/, "").replace(/[_-]/g, " ")),
      id: encodeURIComponent(filename), // Use this as the [id] param
    }));

    return books;
  } catch (error) {
    console.error("Error reading local books:", error);
    return [];
  }
}
