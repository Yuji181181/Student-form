import FabCreateButton from "@/components/common/FabCreateButton";
import Header from "@/components/common/Header";
import type React from "react";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex-1">{children}</div>
      <FabCreateButton />
    </div>
  );
}
