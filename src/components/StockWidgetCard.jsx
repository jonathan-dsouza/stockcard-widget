// components/StockWidgetCard.jsx
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "./ui/card";  // Adjust path as needed
import { Combobox } from "./ui/combobox";  // Adjust path as needed
import { Input } from "./ui/input";  // Adjust path as needed

const StockWidgetCard = () => {
  return (
    <Card className="w-full max-w-[400px] mb-20">
      <CardHeader>
        <div className="flex flex-row justify-between items-center gap-x-6">
          <CardDescription className="text-[15px] dark:text-[rgba(255,255,255,0.6)]">
            Select Market:
          </CardDescription>
          <Combobox />
        </div>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter Stock Symbol" />
      </CardContent>
    </Card>
  );
};

export default StockWidgetCard;
