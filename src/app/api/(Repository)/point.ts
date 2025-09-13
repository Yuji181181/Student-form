import { prisma } from "@/lib/prisma";

export const getPointsHistory = async () => {
  const pointsHistory = await prisma.pointTransaction.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          grade: true,
          currentPoints: true,
          totalEarnedPoints: true,
          createdAt: true,
          updatedAt: true,
          image: true,
        },
      },
      survey: {
        select: {
          id: true,
          title: true,
          description: true,
          googleFormUrl: true,
          questionCount: true,
          deadline: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
  return pointsHistory;
};
