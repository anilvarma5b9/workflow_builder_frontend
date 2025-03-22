"use client";

import Link from "next/link";
import LanguageSelector from "./LanguageSelector";
import Profile from "./Profile";
import FullscreenToggle from "./FullscreenToggle";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";

const HeaderHome = () => {
  return (
    <header className="flex justify-between items-center bg-background-main p-4 shadow-md header-height text-foreground-main">
      <div className="flex items-center space-x-4">

        {/* Logo and Title */}
        <div className="flex items-center justify-between px-4 header-height">
          <Link href="/workflow/list">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Image src="/logo.svg" alt="Logo" width={40} height={40} priority />
              <h1 className="text-2xl font-bold tracking-wide text-template-color-primary">
                Workflow Manager
              </h1>
            </div>
          </Link>
        </div>

      </div>

      {/* User Actions */}
      <div className="flex items-center space-x-4">
        <FullscreenToggle />
        <ThemeToggle />
        <LanguageSelector />
        <Profile />
      </div>

    </header>
  );
};

export default HeaderHome;
