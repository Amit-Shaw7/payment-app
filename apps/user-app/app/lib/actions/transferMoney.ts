"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import db from "@repo/db/client";

export const transferMOney = async (
  reciever: number | string,
  amount: number
) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const userPhone = session?.user?.phone;

  if (!userId)
    return {
      message: "You are not logged in",
    };

  if (Number(reciever) === Number(userPhone))
    return {
      message: "You cannot send money to yourself",
    };

  if (amount <= 0)
    return {
      message: "Transfer Amount must be greater than 0",
    };

  const recieverExists = await db.user.findFirst({
    where: {
      number: String(reciever),
    },
  });

  if (!recieverExists)
    return {
      message: "Reciever does not exist",
    };

  const balance = await db.balance.findFirst({
    where: {
      userId: Number(userId),
    },
  });

  if (balance?.amount && balance?.amount < amount)
    return {
      message: "Insufficient balance",
    };

  console.log(amount, reciever, userId);

  try {
    await db.$transaction([
      db.balance.update({
        where: {
          userId: Number(userId),
        },

        data: {
          amount: {
            decrement: amount,
          },
        },
      }),

      db.balance.update({
        where: {
          userId: recieverExists.id,
        },

        data: {
          amount: {
            increment: amount,
          },
        },
      }),

      db.onRampTransaction.create({
        data: {
          amount: amount,
          status: "Success",
          userId: Number(userId),
          startTime: new Date(),
          token: Math.random().toString(36).substring(2, 15),
          provider: "HDFC Bank",
        },
      }),
    ]);
  } catch (error) {
    console.log(error);

    return error;
  }
};
