"use client";

import type { ResBody } from "@/types/api";
import { useMemo } from "react";
import useSWR, { type KeyedMutator } from "swr";
import type { ZodType } from "zod";

const isIsoDateString = (value: string): boolean => {
  // 例: 2025-09-17T12:34:56.789Z / 2025-09-17T12:34:56Z
  return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
};

const reviveDates = (input: unknown): unknown => {
  if (Array.isArray(input)) {
    return input.map((item) => reviveDates(item));
  }
  if (input && typeof input === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(
      input as Record<string, unknown>,
    )) {
      result[key] = reviveDates(value);
    }
    return result;
  }
  if (typeof input === "string" && isIsoDateString(input)) {
    const time = Date.parse(input);
    if (!Number.isNaN(time)) {
      return new Date(time);
    }
  }
  return input;
};

export class HttpError extends Error {
  status: number;
  statusText: string;
  url: string;
  constructor(
    status: number,
    statusText: string,
    url: string,
    message?: string,
  ) {
    super(message ?? `Request failed: ${status} ${statusText}`);
    this.name = "HttpError";
    this.status = status;
    this.statusText = statusText;
    this.url = url;
  }
}

const defaultFetcher = async (url: string): Promise<ResBody<unknown>> => {
  const response = await fetch(url, { credentials: "include" });
  if (!response.ok) {
    throw new HttpError(response.status, response.statusText, url);
  }
  const json = (await response.json()) as ResBody<unknown>;
  return json;
};

export const useCustomizedSWR = <T>(
  endpoint: string,
  dataSchema: ZodType<T>,
): {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | undefined;
  mutate: KeyedMutator<ResBody<unknown>>;
} => {
  const {
    data: raw,
    error,
    isLoading,
    mutate,
  } = useSWR<ResBody<unknown>>(endpoint, defaultFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  const parsed = useMemo(() => {
    if (!raw || raw.data === undefined) return undefined;
    const revived = reviveDates(raw.data);
    const result = dataSchema.safeParse(revived);
    if (!result.success) {
      // ZodエラーはSWRのerrorに乗せず、コンソール出力に留める
      console.error("Zod parse error", result.error);
      return undefined;
    }
    return result.data;
  }, [raw, dataSchema]);

  return {
    data: parsed,
    isLoading,
    isError: Boolean(error),
    error: error as Error | undefined,
    mutate,
  } as const;
};
