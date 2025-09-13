import type {
  deleteSurveyResponseSchema,
  surveyListSchema,
} from "@/schemas/api/survey";
import type { z } from "zod";

export type SurveyList = z.infer<typeof surveyListSchema>;
export type DeleteSurveyResponse = z.infer<typeof deleteSurveyResponseSchema>;
