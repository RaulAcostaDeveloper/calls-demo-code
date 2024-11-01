import { Card, CardTitle, CardContent, CardHeader } from "../ui/card";
import { ElementType } from "react";
import { CircleDollarSign } from "lucide-react";

type Stat = {
  label: string;
  total: number;
  tooltip: string;
};

type StatCardProps = {
  title: string;
  icon: ElementType | React.ComponentType;
  stats?: Stat[] | undefined;
};

export default function StatCard({ title, icon, stats }: StatCardProps) {
  const Icon = icon;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-start gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-secondary rounded-xl">
            <Icon size={28} />
          </div>
          <CardTitle className="text-[#15192C] text-[24px]">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {stats?.map((stat, index) => (
          <ul key={stat.label}>
            {!stat.label.includes("Revenue") ? (
              <li className="flex flex-col gap-2 pb-4 space-x-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></span>
                    <span className="text-[14px] text-[#15192C] font-medium capitalize break-words">
                      {stat.label}
                    </span>
                  </div>
                </div>

                <span className="text-[#212121] text-[22px] font-bold">
                  {stat.total}
                </span>
              </li>
            ) : (
              <li className="flex flex-col gap-2 pb-4 space-x-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-xl">
                      <CircleDollarSign size={20} />
                    </div>
                    <span className="text-[14px] text-[#15192C] font-medium capitalize text-left flex-1">
                      {stat.label}
                    </span>
                  </div>
                </div>

                <span className="text-[#212121] text-[22px] font-bold mt-2 text-left">
                  $ {stat.total}
                </span>
              </li>
            )}
            {/* Bottom border between list items */}
            {index < stats.length - 1 && (
              <div className="border-b border-[#C2C2C2] mt-2 mb-6"></div>
            )}
          </ul>
        ))}
      </CardContent>
    </Card>
  );
}
