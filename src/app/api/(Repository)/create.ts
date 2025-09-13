import { prisma } from "@/lib/prisma";
import type { CreateSurveyRequest } from "@/types/api/survey";

export const createSurvey = async (
  userId: string,
  data: CreateSurveyRequest,
) => {
  // deadlineをDate型に変換
  const processedData = {
    ...data,
    deadline: data.deadline ? new Date(data.deadline) : undefined,
  };

  const survey = await prisma.survey.create({
    data: {
      ...processedData,
      userId,
      isActive: true,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          grade: true,
          image: true,
        },
      },
    },
  });
  return survey;
};
