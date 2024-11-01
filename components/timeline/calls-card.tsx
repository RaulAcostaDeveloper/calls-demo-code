import { ReactNode } from "react";
import { Card, CardContent } from "../ui/card";
import { CalendarDays } from "lucide-react";

type Props = {
  children: ReactNode;
  date: string;
};

export default function CallsCard({ children, date }: Props) {
  return (
    <div className="w-full space-y-6">
      <div className="flex justify-start items-center">
        <div className="bg-secondary flex justify-center items-center gap-4 p-[10px] rounded-md">
          <CalendarDays className="h-4 w-4 mr-2" />
          <span className="text-[14px] lg:text-base">
            {date} (
            {new Date(
              new Date(date).getTime() + 1000 * 60 * 60 * 24
            ).toLocaleDateString("en-US", {
              weekday: "long",
            })}
            )
          </span>
        </div>
      </div>
      <Card className="max-md:border-none max-md:shadow-none">
        <CardContent className="p-5 max-md:py-5 max-md:px-0 max-md:-mx-3 flex flex-col maxm-md:gap-1.5 gap-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
