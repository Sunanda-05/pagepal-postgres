import { ApplicationStatus, Role } from "../../generated";
import prisma from "../utils/db";

const getAllApplyService = async (status?: ApplicationStatus) => {
  try {
    const applications = await prisma.authorApplication.findMany({
      where: { status: status },
    });
    return applications;
  } catch (error) {
    console.error(error);
    throw new Error("Fetching applications failed");
  }
};

const reviewApplyService = async (
  id: string,
  adminId: string,
  status: ApplicationStatus,
  reason?: string
) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const application = await tx.authorApplication.update({
        where: {
          id,
          status: "PENDING",
        },
        data: {
          status,
          reviewedById: adminId,
          reason,
          reviewedAt: new Date(),
        },
        include: {
          user: true,
        },
      });

      if (status === "APPROVED") {
        await tx.user.update({
          where: { id: application.userId },
          data: { role: Role.AUTHOR },
        });
      }

      return application;
    });
  } catch (error) {
    console.error(error); //!TODO check if application not found
    throw new Error("Reviewing application failed");
  }
};

export { getAllApplyService, reviewApplyService };
