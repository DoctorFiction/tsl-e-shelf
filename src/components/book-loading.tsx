import Image from "next/image";

interface LoadingSpinnerProps {
  bookTitle: string | null;
  bookCover: string | null;
}

export function BookLoading({ bookTitle, bookCover }: LoadingSpinnerProps) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col gap-4 items-center justify-center">
      <p className="text-xl">{bookTitle}</p>
      {bookCover && <Image width={400} height={500} alt={`${bookTitle}-cover`} src={bookCover} />}
      <div className="h-6 w-6 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
