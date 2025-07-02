"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function createOnRampTransaction(
  amount: number,
  provider: string
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const token = Math.random().toString(36).substring(2, 15);
  if (!userId)
    return {
      message: "You are not logged in",
    };

  const txn = await prisma.onRampTransaction.create({
    data: {
      amount: amount,
      status: "Processing",
      userId: Number(userId),
      provider: provider,
      startTime: new Date(),
      token,
    },
  });
  return txn;
}
