"use client";

import { SurveyDetailSkeleton } from "@/components/domain/(authenticated)/survey/SurveyDetailSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSurveyDetailPage } from "@/hooks/domain/(authenticated)/useSurveyDetailPage";
import { authClient } from "@/lib/auth-client";
import { formatDate } from "@/lib/formatter";
import { ExternalLink, Pencil } from "lucide-react";
import { useSearchParams } from "next/navigation";
import type React from "react";

interface SurveyDetailPageProps {
  id: string;
}

export const SurveyDetailPage: React.FC<SurveyDetailPageProps> = (props) => {
  const { survey, isLoading, isError } = useSurveyDetailPage({ id: props.id });
  const { data: session } = authClient.useSession();
  const searchParams = useSearchParams();
  const created = searchParams?.get("created") === "1";
  const updated = searchParams?.get("updated") === "1";

  if (isError) {
    return (
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-balance text-lg">エラー</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              データの取得に失敗しました。時間をおいて再度お試しください。
            </CardDescription>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (isLoading || !survey) {
    return (
      <main className="container mx-auto px-4 py-8">
        <SurveyDetailSkeleton />
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {(created || updated) && (
        <div className="mx-auto mb-4 w-full max-w-2xl rounded-md border border-emerald-300/60 bg-emerald-50 px-4 py-2 text-emerald-700 text-sm">
          {created ? "投稿を作成しました。" : "投稿を更新しました。"}
        </div>
      )}
      <Card className="transition-shadow hover:shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarImage src={survey.user.image ?? "/placeholder.svg"} />
                <AvatarFallback />
              </Avatar>
              <div>
                <CardTitle className="text-balance text-lg">
                  <span>{survey.title}</span>
                </CardTitle>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">
                    {survey.user.name}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {formatDate(survey.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-4 text-pretty">
            {survey.description ?? "説明はありません"}
          </CardDescription>

          <div className="mb-4 flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
            <span>設問数: {survey.questionCount}</span>
            <span>期限: {formatDate(survey.deadline)}</span>
            <span>状態: {survey.isActive ? "公開中" : "非公開"}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => window.open(survey.googleFormUrl, "_blank")}
              className="gap-1"
              title="Googleフォームを新しいタブで開く"
            >
              <ExternalLink className="h-4 w-4" />
              回答する
            </Button>
            {session?.user?.id === survey.user.id && (
              <Button
                variant="outline"
                className="gap-1"
                title="この投稿を編集"
                onClick={() => {
                  window.location.href = `/survey/${survey.id}/edit`;
                }}
              >
                <Pencil className="h-4 w-4" />
                編集
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default SurveyDetailPage;
