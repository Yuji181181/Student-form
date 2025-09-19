"use server";

import { useUser } from "@/app/actions/useUser";
import { userAuthenticationCheck } from "@/app/actions/userAuthenticationCheck";
import { UserDropdown } from "@/components/common/UserDropdown";
import { Separator } from "@/components/ui/separator";
import { Coins, Users } from "lucide-react";
import { redirect } from "next/navigation";

import Link from "next/link";

export default async function Header() {
  const userId = await userAuthenticationCheck();
  if (!userId) redirect("/login");
  const user = await useUser(userId);

  return (
    <header className="sticky top-0 z-50 border-b bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <Link href="/">
              <h1 className="cursor-pointer font-bold text-2xl text-foreground">
                アンケート共有掲示板
              </h1>
            </Link>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              {/* ポイント表示 */}
              <div className="flex items-center gap-2 rounded-lg bg-secondary/10 px-3 py-2">
                <Coins className="h-5 w-5 text-secondary" />
                <span className="font-semibold text-foreground">
                  {user.currentPoints}pt
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Separator orientation="vertical" className="h-8" />
                <UserDropdown user={user} />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
