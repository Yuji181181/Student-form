import { z } from "zod";

export const userRankingResponseSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    grade: z.number().nullable(),
    currentPoints: z.number(),
    totalEarnedPoints: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    image: z.string().nullable(),
  }),
);
