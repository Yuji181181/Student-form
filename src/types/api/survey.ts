import type { createSurveyRequestSchema } from "@/schemas/api/create";
import type { surveyListSchema, surveySchema } from "@/schemas/api/read";
import type { surveyParamsSchema } from "@/schemas/api/survey";
import type { updateSurveyRequestSchema } from "@/schemas/api/update";
import type { z } from "zod";

export type SurveyList = z.infer<typeof surveyListSchema>;
export type Survey = z.infer<typeof surveySchema>;
export type SurveyParams = z.infer<typeof surveyParamsSchema>;
export type UpdateSurveyRequest = z.infer<typeof updateSurveyRequestSchema>;
export type UpdateSurveyResponse = z.infer<typeof surveySchema>;
export type CreateSurveyRequest = z.infer<typeof createSurveyRequestSchema>;
export type CreateSurveyResponse = z.infer<typeof surveySchema>;
