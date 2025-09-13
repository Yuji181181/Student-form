import { z } from "zod";

export const surveyListSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    googleFormUrl: z.string(),
    questionCount: z.number(),
    deadline: z.date().nullable(),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    user: z.object({
      id: z.string(),
      name: z.string(),
      grade: z.number().nullable(),
      image: z.string().nullable(),
    }),
  }),
);

export const deleteSurveyResponseSchema = z.object({
  id: z.string(),
  message: z.string(),
});
