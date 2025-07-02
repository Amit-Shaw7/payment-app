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

  const transferMoney = () => {
    const res: any = transferMOney(receiver, amount || 0);
    console.log(res);
    setError(res.message);
  };
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Card title="People to people transfer">
        <h1>People to people transfer</h1>
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
            setAmount(Number(value)*100);
          }}
        />
        {error && <p className="text-red-500">{error}</p>}
        <Button onClick={transferMoney}>Transfer</Button>
      </Card>
    </div>
  );
};

export default PTPTRansfer;