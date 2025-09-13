import { prisma } from "@/lib/prisma";

export const getUserRankingData = async () => {
  const users = await prisma.user.findMany({
    orderBy: { totalEarnedPoints: "desc" },
    take: 10,
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
  });
  return users;
};
