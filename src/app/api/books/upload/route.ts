import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
    }

    if (!file.name.endsWith(".epub")) {
      return NextResponse.json({ error: "Geçersiz dosya formatı. Sadece .epub dosyaları desteklenmektedir." }, { status: 400 });
    }

    // Convert the file to a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure the books directory exists
    const booksDir = path.join(process.cwd(), "public", "books");
    try {
      await mkdir(booksDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}-${sanitizedFilename}`;
    const filepath = path.join(booksDir, filename);

    // Save the file
    await writeFile(filepath, buffer);

    // Return the book ID (encoded filename)
    const bookId = encodeURIComponent(filename);

    return NextResponse.json({ 
      success: true, 
      id: bookId,
      filename: filename,
      message: "Kitap başarıyla yüklendi" 
    });
  } catch (error) {
    console.error("Error uploading book:", error);
    return NextResponse.json({ error: "Kitap yüklenirken bir hata oluştu" }, { status: 500 });
  }
}
