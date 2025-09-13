import { z } from "zod";

export const surveyParamsSchema = z.object({
  id: z.string().uuid(),
});
