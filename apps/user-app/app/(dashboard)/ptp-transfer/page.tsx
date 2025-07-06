"use client";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/text-input";
import React from "react";
import { transferMOney } from "../../lib/actions/transferMoney";

const PTPTRansfer = () => {
  const [amount, setAmount] = React.useState<number>();
  const [receiver, setReceiver] = React.useState("");
  const [error, setError] = React.useState("");

  const reset = () => {
    setAmount(0);
    setReceiver("");
  };

  const transferMoney = async () => {
    const res: any = await transferMOney(receiver, amount || 0);
    setError(res.message);
    console.log(res);

    // reset();
  };
  return (
    <div className="h-screen w-screen flex items-center  justify-center">
      <Card title="People to people transfer">
        <div className="">
          <div className="flex flex-col justify-between h-full w-[300px]">
            <TextInput
              label={"Receiver"}
              placeholder={"Receiver"}
              onChange={(value) => {
                setReceiver(value);
              }}
            />
            <TextInput
              label={"Amount"}
              placeholder={"Amount"}
              onChange={(value) => {
                setAmount(Number(value) * 100);
              }}
            />
          </div>

          <div className="mt-5">
            {error && <p className="text-red-500">{error}</p>}
            <Button onClick={transferMoney}>Transfer</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PTPTRansfer;
