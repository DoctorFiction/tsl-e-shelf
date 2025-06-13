import ClientReader from "@/components/client-reader";

type Params = { id: string };

export default async function ClientReaderPage({ params }: { params: Params }) {
  const id = (await params).id;
  const res = await fetch(`https://gutendex.com/books/${id}`);
  const book = await res.json();
  const { formats, authors, title } = book;
  const htmlUrl = formats["text/plain; charset=us-ascii"];

  const formatUrlList = Object.entries(formats).map(([format, url]) => ({
    format,
    url,
  }));

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="p-4 bg-gray-100 border-b">
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm text-gray-600">
          {authors.map((a: { name: string }) => a.name).join(", ")}
        </p>
      </div>
      <ClientReader bookUrl={htmlUrl} availableFormats={formatUrlList} />
    </div>
  );
}
