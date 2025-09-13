import { z } from "zod";

export const pointHistorySchema = z.array(
  z.object({
    id: z.string(),
    userId: z.string(),
    surveyId: z.string().nullable(),
    transactionType: z.enum(["EARNED", "REDEEMED"]),
    points: z.number(),
    description: z.string().nullable(),
    createdAt: z.date(),
  }),
);
