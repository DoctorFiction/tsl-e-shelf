import Image from "next/image";
import Link from "next/link";

export default function Header() {
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
        {/* TODO update the nav buttons */}
        <li>
          <div className="px-4 py-2 rounded-sm border border-blue-700">
            <Link href="/">Ana Sayfa</Link>
          </div>
        </li>
        <li>
          <div className="px-4 py-2 rounded-sm bg-blue-700 text-white font-bold">
            <Link href="/books">Kitaplar</Link>
          </div>
        </li>
        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-blue-300 rounded-full ">
          <span>HÖ</span>
        </div>
      </ul>
    </div>
  );
}
