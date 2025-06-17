"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "./ui/button";

export default function Header() {
  const pathname = usePathname();
  return (
    <div className="border-black/10 border-b flex items-center justify-between p-4 bg-white dark:bg-gray-900">
      <Link href="/">
        <Image src="https://www.atlaskitap.com/bakim/nobelyayin.png" alt="nobelyayin" width={80} height={80} />
      </Link>
      <ul className="flex items-center gap-3">
        <li>
          <Button variant="link" className={`px-4 py-2 rounded-sm font-bold ${pathname === "/" ? "underline underline-offset-8 text-blue-700 dark:text-blue-300" : ""}`}>
            <Link href="/">Ana Sayfa</Link>
          </Button>
        </li>
        <li>
          <Button variant="link" className={`px-4 py-2 rounded-sm font-bold ${pathname === "/books" ? "underline underline-offset-8 text-blue-700 dark:text-blue-300" : ""}`}>
            <Link href="/books">Kitaplar</Link>
          </Button>
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
