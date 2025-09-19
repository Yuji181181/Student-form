"use client";

import { HttpError } from "@/hooks/common/useCustomizedSWR";
import { createSurveyRequestSchema } from "@/schemas/api/create";
import { surveySchema } from "@/schemas/api/read";
import type { ResBody } from "@/types/api";
import type { Survey } from "@/types/api/survey";
import useSWRMutation from "swr/mutation";

// レスポンスのDateを復元
const isIsoDateString = (value: string): boolean => {
  return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
};

const reviveDates = (input: unknown): unknown => {
  if (Array.isArray(input)) return input.map((i) => reviveDates(i));
  if (input && typeof input === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
      result[k] = reviveDates(v);
    }
    return result;
  }
  if (typeof input === "string" && isIsoDateString(input)) {
    const time = Date.parse(input);
    if (!Number.isNaN(time)) return new Date(time);
  }
  return input;
};

type CreateInput = unknown; // 実行時にzodで検証する

const postCreator = async (
  url: string,
  { arg }: { arg: CreateInput },
): Promise<Survey> => {
  // 入力をZodで検証（UI層のresolverに加えて二重バリデーション）
  const parsed = createSurveyRequestSchema.safeParse(arg);
  if (!parsed.success) {
    throw new Error("入力値が不正です。フォームを確認してください。");
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(parsed.data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new HttpError(res.status, res.statusText, url, text);
  }
  const json = (await res.json()) as ResBody<unknown>;
  const revived = reviveDates(json.data);
  const verified = surveySchema.safeParse(revived);
  if (!verified.success) {
    throw new Error("サーバーレスポンスの形式が不正です。");
  }
  return verified.data;
};

export const useCreateSurvey = () => {
  const { trigger, isMutating, error, data, reset } = useSWRMutation<
    Survey,
    Error,
    string,
    CreateInput
  >("/api/survey", postCreator);

  return {
    create: trigger,
    isCreating: isMutating,
    error,
    created: data,
    reset,
  } as const;
};
