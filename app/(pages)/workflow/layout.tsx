"use client";

import HeaderHome from "@/app/components/common/HeaderHome";
import SettingsSidebar from "@/app/components/common/SettingsSidebar";

export default function MasterLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex h-screen w-full overflow-x-hidden">

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full">
        {/* GPS Header */}
        <HeaderHome />

        {/* Divider */}
        <div className="border-b border-medium"></div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background-secondary">
          <div className="h-full w-full text-foreground-main">{children}</div>
        </main>

      </div>

      {/* Settings Sidebar */}
      <SettingsSidebar />
    </div>
  );
}
