import express from "express";
import db from "@repo/db/client";

const app = express();

app.use(express.json());

app.post("/hdfcWebhook", async (req, res) => { 
  
  //TODO: Add zod validation here?
  const paymentInformation = {
    token: req.body.token,
    userId: Number(req.body.user_identifier),
    amount: req.body.amount,
  };
  console.log(paymentInformation);
  // Update balance in db, add txn

  const isTransactionProcessing = await db.onRampTransaction.findFirst({
    where: {
      token: paymentInformation.token,
      status: "Processing",
    },
  })

  if(!isTransactionProcessing){
    res.status(200).json({ message: "Payment already captured" });
  }

  try {
    await db.$transaction([
      db.balance.update({
        where: {
          userId: paymentInformation.userId,
        },

        data: {
          amount: {
            increment: paymentInformation.amount,
          },
        },
      }),

      db.onRampTransaction.update({
        where: {
          token: paymentInformation.token,
        },

        data: {
          status: "Success",
        },
      }),
    ]);
    res.status(200).json({ message: "Captured request" });
  } catch (error) {
    console.error(error);
    res.status(411).json({ message: "Failed to capture request" });
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
