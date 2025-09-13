import { prisma } from "@/lib/prisma";

export const getSurveyById = async (id: string) => {
  const survey = await prisma.survey.findUnique({
    where: { id },
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
