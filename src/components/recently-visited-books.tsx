import { getBooks } from "@/lib/books";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Typography } from "./ui/typography";

interface IBook {
  id: number | string;
  title: string;
  authors: { name: string }[];
  formats: { [key: string]: string };
}

export default async function RecentlyVisitedBooks() {
  const data = await getBooks();
  const books = data.results.slice(0, 10);

  return (
    <div className="mt-8 p-2">
      <Typography variant="h2">En Son Ziyaret Edilen Kitaplar</Typography>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {books.map((book: IBook) => (
          <Card
            key={book.id}
            className="bg-gray-800/80 border border-gray-700 text-white rounded-2xl overflow-hidden shadow-xl flex flex-col transition-all duration-150 transform  hover:shadow-2xl hover:border-blue-500"
          >
            <CardHeader className="p-0 relative h-48 w-full overflow-hidden flex items-center justify-center bg-white">
              <Image
                src={book.formats["image/jpeg"]}
                alt={book.title}
                fill
                className="object-contain w-full h-full transition-all duration-150 rounded-t-2xl"
                sizes="(max-width: 768px) 100vw, 160px"
              />
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between p-1">
              <CardTitle className="text-base font-semibold  text-white/90 group-hover:text-blue-400 transition-colors duration-200">{book.title}</CardTitle>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch p-1 pt-0">
              <Typography variant="subtitle1" className="text-sm text-white mb-2">
                {book.authors.map((author) => author.name).join(", ")}
              </Typography>

              <Link href={`/reader/${book.id}`} passHref>
                <Button className="mt-auto w-full text-center text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg px-4 py-2 shadow transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                  Oku
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
