"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import type React from "react";

const FabCreateButton: React.FC = () => {
  return (
    <Link href="/survey/new" aria-label="新規投稿">
      <Button
        className={cn(
          "fixed",
          "right-6",
          "bottom-6",
          "z-50",
          "w-14",
          "h-14",
          "rounded-full",
          "p-0",
          "shadow-lg",
          "transition-transform",
          "hover:scale-105",
        )}
        aria-label="新規投稿"
        title="新規投稿"
      >
        <span className="sr-only">新規投稿</span>
        <Plus className="h-7 w-7" />
      </Button>
    </Link>
  );
};

export default FabCreateButton;
