type Params = { id: string };

export default async function ReaderPage({ params }: { params: Params }) {
  const res = await fetch(`https://gutendex.com/books/${params.id}`);
  const book = await res.json();
  const htmlUrl = book.formats["text/html"];

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="p-4 bg-gray-100 border-b">
        <h1 className="text-xl font-bold">{book.title}</h1>
        <p className="text-sm text-gray-600">
          {book.authors.map((a: { name: string }) => a.name).join(", ")}
        </p>
      </div>
      <iframe
        src={htmlUrl}
        className="flex-1 w-full border-0"
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  );
}
