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

  if (!userId) {
    return {
      message: "You are not logged in",
    };
  }

  if (Number(reciever) === Number(userPhone)) {
    return {
      message: "You cannot send money to yourself",
    };
  }
  if (amount <= 0) {
    return {
      message: "Transfer Amount must be greater than 0",
    };
  }
  const recieverExists = await db.user.findFirst({
    where: {
      number: String(reciever),
    },
  });

  if (!recieverExists) {
    return {
      message: "Reciever does not exist",
    };
  }

  try {
    await db.$transaction(async (txn) => {
      const sender = await db.balance.findUnique({
        where: {
          userId: Number(userId),
        },
      });

      console.log("before", sender.amount);

      await new Promise((resolve) => setTimeout(resolve, 3000));

      console.log("after", sender.amount);

      if (sender?.amount && sender?.amount < amount) {
        return {
          message: "Insufficient balance",
        };
      }

      await txn.balance.update({
        where: {
          userId: Number(userId),
        },

        data: {
          amount: {
            decrement: amount,
          },
        },
      });

      await txn.balance.update({
        where: {
          userId: recieverExists.id,
        },

        data: {
          amount: {
            increment: amount,
          },
        },
      });
    });

    let users: any = [];
    return { message: "Transfer successful", users };
  } catch (error) {
    console.log(error);
    return error;
  }
};
