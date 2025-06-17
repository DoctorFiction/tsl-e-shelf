import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";

export default function Header() {
  return (
    <div className="border-black/10 border-b flex items-center justify-between p-4 bg-white dark:bg-gray-900">
      <Link href="/">
        <Image src="https://www.atlaskitap.com/bakim/nobelyayin.png" alt="nobelyayin" width={80} height={80} />
      </Link>
      <ul className="flex items-center gap-3">
        {/* TODO update the nav buttons */}
        <li>
          <div className="px-4 py-2 rounded-sm border border-blue-700 text-blue-700 dark:text-blue-300 dark:border-blue-300">
            <Link href="/">Ana Sayfa</Link>
          </div>
        </li>
        <li>
          <div className="px-4 py-2 rounded-sm bg-blue-700 text-white font-bold dark:bg-blue-500 dark:text-gray-900">
            <Link href="/books">Kitaplar</Link>
          </div>
        </li>
        <li>
          <ModeToggle />
        </li>
        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-blue-300 rounded-full text-white dark:bg-blue-700 dark:text-gray-100">
          <span>HÖ</span>
        </div>
      </ul>
    </div>
  );
}
