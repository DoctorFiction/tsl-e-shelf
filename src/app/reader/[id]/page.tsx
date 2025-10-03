import EpubReader from "@/components/epub-reader";

export default async function ReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const decodedId = decodeURIComponent(id);

  const isRemoteUrl = decodedId.startsWith("http://") || decodedId.startsWith("https://");

  const bookUrl = isRemoteUrl ? `/api/book?url=${encodeURIComponent(decodedId)}` : `/books/${decodedId}`;

  return <EpubReader url={bookUrl} />;
}
