import EpubReader from "@/components/epub-reader";

export default async function ReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <EpubReader url={`/books/${id}`} />;
}
