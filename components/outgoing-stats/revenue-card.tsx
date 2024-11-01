import { CircleDollarSign } from "lucide-react";
import { Card, CardTitle, CardHeader } from "../ui/card";

type RevenueStat = {
  label1: string;
  label2?: string;
  total1: number;
  total2?: number;
};

export default function RevenueCard({
  label1,
  label2,
  total1,
  total2,
}: RevenueStat) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-start gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-secondary rounded-xl">
            <CircleDollarSign className="fill-[#212121] text-white" size={28} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[#15192C] text-[14px] font-medium">
              {label1}
            </span>
          </div>
        </div>
        <div className="flex justify-start items-start">
          <span className="text-[#212121] text-[22px] font-bold">
            $ {total1}
          </span>
        </div>
      </CardHeader>

      {total2 && label2 && (
        <CardHeader>
          <div className="flex items-start justify-start gap-4">
            <div className="flex items-center justify-center w-16 h-16 bg-secondary rounded-xl">
              <CircleDollarSign
                className="fill-[#212121] text-white"
                size={28}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[#15192C] text-[14px] font-medium">
                {label2}
              </span>
            </div>
          </div>
          <div className="flex justify-start items-start">
            <span className="text-[#212121] text-[22px] font-bold">
              $ {total2}
            </span>
          </div>
        </CardHeader>
      )}
    </Card>
  );
}
