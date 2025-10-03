"use client";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu } from "./menu";

export default function Header() {
  return (
    <div className="border-black/10 border-b flex items-center justify-between p-4 bg-white dark:bg-gray-900">
      <Link href="/">
        <Image src="https://www.nobelyayin.com/templates/images/logo.png?v=01" alt="nobelyayin" width={80} height={80} />
      </Link>
      <ul className="flex items-center gap-3">
        {/* TODO: Add a 'Dev Tools' button here, visible only in development mode. */}
        <Menu />
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
