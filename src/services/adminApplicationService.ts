import { ApplicationStatus } from "../../generated";
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
    const application = await prisma.authorApplication.update({
      where: { id, status: "PENDING" },
      data: {
        status,
        reviewedById: adminId,
        reason,
        reviewedAt: new Date(),
      },
    });

    return application;
  } catch (error) {
    console.error(error); //!TODO check if application not found
    throw new Error("Reviewing application failed");
  }
};

export { getAllApplyService, reviewApplyService };
