import Link from "next/link";

export default function Header() {
  return (
    <div className="border-black/10 border-b h-[60px] flex items-center justify-between px-5">
      <div>Logo</div>
      <ul className="flex items-center gap-3">
        <li>
          <Link href="/">Ana Sayfa</Link>
        </li>
        <li>
          <Link href="/books">Kitaplar</Link>
        </li>
      </ul>
    </div>
  );
}
