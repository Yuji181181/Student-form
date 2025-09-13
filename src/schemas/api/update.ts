import { z } from "zod";

export const updateSurveyRequestSchema = z.object({
  title: z.string().max(200).optional(),
  description: z.string().optional(),
  googleFormUrl: z.string().url().optional(),
  questionCount: z.number().int().min(1).optional(),
  deadline: z.string().datetime().optional(),
  isActive: z.boolean().optional(),
});
