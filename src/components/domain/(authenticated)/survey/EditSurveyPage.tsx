"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HttpError } from "@/hooks/common/useCustomizedSWR";
import { useSurveyDetailPage } from "@/hooks/domain/(authenticated)/useSurveyDetailPage";
import { useUpdateSurvey } from "@/hooks/domain/(authenticated)/useUpdateSurvey";
import { updateSurveyRequestSchema } from "@/schemas/api/update";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface EditSurveyPageProps {
  id: string;
}

const normalizeDeadlineToISO = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const raw = value.trim();
  if (!raw) return undefined;
  let candidate = raw.replaceAll("/", "-");
  if (candidate.includes(" ") && !candidate.includes("T")) {
    candidate = candidate.replace(" ", "T");
  }
  const d = new Date(candidate);
  if (!Number.isNaN(d.getTime())) return d.toISOString();
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?Z$/.test(raw)) {
    return raw;
  }
  return undefined;
};

const formSchema = updateSurveyRequestSchema.extend({
  deadline: z
    .preprocess((v) => normalizeDeadlineToISO(v), z.string().datetime())
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

const toLocalInputValue = (
  date: Date | null | undefined,
): string | undefined => {
  if (!date) return undefined;
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
};

export const EditSurveyPage: React.FC<EditSurveyPageProps> = (props) => {
  const router = useRouter();
  const { survey, isLoading, isError, error } = useSurveyDetailPage({
    id: props.id,
  });
  const {
    update,
    isUpdating,
    error: updateError,
    updated,
    reset: resetMutation,
  } = useUpdateSurvey(props.id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const defaults = useMemo(() => {
    if (!survey) return undefined;
    return {
      title: survey.title,
      description: survey.description ?? "",
      googleFormUrl: survey.googleFormUrl,
      questionCount: survey.questionCount,
      deadline: toLocalInputValue(survey.deadline ?? undefined),
      isActive: survey.isActive,
    } satisfies Partial<FormValues> as FormValues;
  }, [survey]);

  useEffect(() => {
    if (defaults) reset(defaults);
  }, [defaults, reset]);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      setSubmitError(null);
      await update({
        ...values,
        deadline:
          typeof values.deadline === "string" && values.deadline.trim() === ""
            ? undefined
            : values.deadline,
      });
    },
    [update],
  );

  useEffect(() => {
    if (updated) {
      router.push(`/survey/${props.id}?updated=1`);
      resetMutation();
    }
  }, [updated, resetMutation, router, props.id]);

  useEffect(() => {
    if (updateError) setSubmitError(updateError.message);
  }, [updateError]);

  if (isError) {
    return (
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-balance text-lg">エラー</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              {(() => {
                const status =
                  error instanceof HttpError ? error.status : undefined;
                if (status === 404) return "対象の投稿が見つかりません。";
                if (status === 403)
                  return "この投稿を編集する権限がありません。";
                if (status === 401) return "ログインが必要です。";
                return "データの取得に失敗しました。時間をおいて再度お試しください。";
              })()}
            </CardDescription>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (isLoading || !survey) {
    return (
      <main className="container mx-auto px-4 py-8">
        <Card className="mx-auto w-full max-w-2xl">
          <CardHeader>
            <CardTitle>読み込み中...</CardTitle>
            <CardDescription>編集フォームを準備しています。</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle>投稿を編集</CardTitle>
          <CardDescription>内容を更新して保存してください。</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {submitError && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-destructive text-sm">
                {submitError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                className="border-black/30"
                aria-invalid={!!errors.title}
                {...register("title")}
              />
              {errors.title && (
                <p className="text-destructive text-sm">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">説明（任意）</Label>
              <Textarea
                id="description"
                rows={6}
                className="min-h-32 border border-black/30 text-base leading-relaxed focus:border-black/50 focus-visible:ring-black/30"
                aria-invalid={!!errors.description}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-destructive text-sm">
                  {errors.description.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="googleFormUrl">GoogleフォームURL</Label>
              <Input
                id="googleFormUrl"
                className="border-black/30"
                type="url"
                aria-invalid={!!errors.googleFormUrl}
                {...register("googleFormUrl")}
              />
              {errors.googleFormUrl && (
                <p className="text-destructive text-sm">
                  {errors.googleFormUrl.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionCount">設問数</Label>
              <Input
                id="questionCount"
                className="border-black/30"
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                aria-invalid={!!errors.questionCount}
                {...register("questionCount", { valueAsNumber: true })}
              />
              {errors.questionCount && (
                <p className="text-destructive text-sm">
                  {errors.questionCount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">締切（任意）</Label>
              <Input
                id="deadline"
                className="border-black/30"
                type="datetime-local"
                aria-invalid={!!errors.deadline}
                {...register("deadline", {
                  setValueAs: (v) =>
                    typeof v === "string" && v.trim() === "" ? undefined : v,
                })}
              />
              {errors.deadline && (
                <p className="text-destructive text-sm">
                  {errors.deadline.message as string}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                キャンセル
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "保存中..." : "保存する"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default EditSurveyPage;
