"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";

import { useTranslation } from "@/app/utils/language/i18n";
import AuthUtil from '@/app/utils/auth/AuthUtil';

const Profile = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    AuthUtil.clearAuth();
    router.push("/auth/login");
  };

  // ✅ Get values safely on client-side only
  useEffect(() => {
    setUserName(AuthUtil.getUserName());
    setUserEmail(AuthUtil.getUserEmail());
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {/* Profile Section */}
      <div
        className="flex items-center cursor-pointer space-x-2 w-64"
        onClick={toggleDropdown}
      >
        <div className="flex items-center justify-center rounded-lg overflow-hidden w-10 h-10 bg-background-main-card border-2 border-template-color-primary">
          <Image
            src="/profile.webp"
            alt="Profile"
            width={40}
            height={40}
            className="object-cover"
            priority
          />
        </div>
        <div>
          <p className="text-foreground-main font-semibold">
            {userName || ""}
          </p>
          <p className="text-foreground-secondary text-sm">
            {userEmail || ""}
          </p>
        </div>
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div
          className="absolute right-0 mt-2 bg-background-main-card border border-border-medium shadow-lg z-50"
          style={{
            width: containerRef.current ? containerRef.current.offsetWidth : "auto",
          }}
        >
          <ul className="flex flex-col space-y-1">
            <li
              onClick={handleLogout}
              className="flex items-center space-x-2 cursor-pointer text-foreground-main hover:text-template-color-primary hover:bg-background-main-card-hover p-2"
            >
              <FiLogOut />
              <span>{t("header.logout")}</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Profile;
