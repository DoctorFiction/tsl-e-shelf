"use server";

export async function getBooks() {
  const res = await fetch("https://gutendex.com/books");
  return res.json();
}
