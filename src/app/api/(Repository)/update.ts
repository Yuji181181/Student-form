import { prisma } from "@/lib/prisma";
import type { UpdateSurveyRequest } from "@/types/api/survey";

export const updateSurvey = async (id: string, data: UpdateSurveyRequest) => {
  // deadlineをDate型に変換
  const processedData = {
    ...data,
    deadline: data.deadline ? new Date(data.deadline) : undefined,
  };

  const updatedSurvey = await prisma.survey.update({
    where: { id },
    data: {
      ...processedData,
      updatedAt: new Date(),
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
  return updatedSurvey;
};
