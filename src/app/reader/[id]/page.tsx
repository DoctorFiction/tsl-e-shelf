import EpubReader from "@/components/epub-reader";
import { DevtoolProtection } from "@/components/devtool-protection";

function extractBookId(idOrUrl: string): string {
  try {
    // Try to parse it as a URL
    const url = new URL(idOrUrl);
    const pathname = url.pathname;
    // Get the last part of the path
    const filename = pathname.substring(pathname.lastIndexOf("/") + 1);
    // Remove the .epub extension
    const bookId = filename.replace(".epub", "");
    if (bookId) {
      return bookId;
    }
  } catch (error) {
    console.log("error", error);
    // Not a valid URL, so it might be an ID itself
  }
  // Fallback to returning the original string if it's not a URL or if extraction fails
  return idOrUrl;
}

export default async function ReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const decodedIdOrUrl = decodeURIComponent(id);

  const bookId = extractBookId(decodedIdOrUrl);

  const isRemoteUrl = decodedIdOrUrl.startsWith("http://") || decodedIdOrUrl.startsWith("https://");

  const bookUrl = isRemoteUrl ? `/api/book?url=${encodeURIComponent(decodedIdOrUrl)}` : `/books/${decodedIdOrUrl}`;

  return (
    <DevtoolProtection>
      <EpubReader url={bookUrl} bookId={bookId} />
    </DevtoolProtection>
  );
}
