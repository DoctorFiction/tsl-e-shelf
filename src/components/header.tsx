import Image from "next/image";
import Link from "next/link";

export default function Header() {
  // TODO add nav progress
  return (
    <div className="border-black/10 border-b  flex items-center justify-between p-4">
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
          <span>HÖ</span>
        </div>
      </ul>
    </div>
  );
}
