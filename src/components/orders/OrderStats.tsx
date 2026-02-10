import { ShoppingBag, DollarSign, Users, TrendingUp } from "lucide-react";

interface Stat {
  label: string;
  value: string | number;
  icon: React.ElementType;
  change?: string;
}

interface OrdersStatsProps {
  stats: Stat[];
}

export function OrdersStats({ stats }: OrdersStatsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-xl border border-zm-greyOlive/10 bg-zm-white p-5 shadow-card"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-body text-sm font-medium text-zm-greyOlive">
                {stat.label}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zm-deepTeal/10">
                <Icon className="h-5 w-5 text-zm-deepTeal" />
              </div>
            </div>
            <p className="font-body text-2xl font-bold text-zm-stoneBrown">
              {stat.value}
            </p>
            {stat.change && (
              <p className="mt-1 text-xs font-medium text-zm-deepTeal">
                {stat.change} from last month
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
