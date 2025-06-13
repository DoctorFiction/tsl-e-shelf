import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="border-black/10 border-b h-[60px] flex items-center justify-between px-5">
      {/* TODO: Update logo, add placeholder profile avatar */}
      <Link href="/">
        <Image
          src="https://www.atlaskitap.com/bakim/nobelyayin.png"
          alt="nobelyayin"
          width={80}
          height={80}
        />
      </Link>
      <ul className="flex items-center gap-3">
        <li>
          <Link href="/">Ana Sayfa</Link>
        </li>
        <li>
          <Link href="/books">Kitaplar</Link>
        </li>
        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-blue-300 rounded-full ">
          <span>SY</span>
        </div>
      </ul>
    </div>
  );
}
