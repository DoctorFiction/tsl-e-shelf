import EpubReader from "@/components/epub-reader";

export default async function ReaderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="w-full flex flex-col">
      <EpubReader url={`/books/${id}`} />
    </div>
  );
}
