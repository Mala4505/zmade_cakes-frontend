import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { dashboardApi } from '../services/api';
import type { KPIData } from '../services/api.types';
import {
  PackageOpenIcon,
  CheckCircleIcon,
  ShoppingCartIcon,
  DollarSignIcon,
  ClockIcon,
  ArchiveIcon,
  AlertCircleIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// Mock chart data - will be replaced with real data when backend supports it
const bookingsData = [
  { name: 'Mon', bookings: 12 },
  { name: 'Tue', bookings: 19 },
  { name: 'Wed', bookings: 15 },
  { name: 'Thu', bookings: 22 },
  { name: 'Fri', bookings: 30 },
  { name: 'Sat', bookings: 45 },
  { name: 'Sun', bookings: 38 }
];

const revenueData = [
  { name: 'Mon', revenue: 1200 },
  { name: 'Tue', revenue: 1900 },
  { name: 'Wed', revenue: 1500 },
  { name: 'Thu', revenue: 2200 },
  { name: 'Fri', revenue: 3000 },
  { name: 'Sat', revenue: 4500 },
  { name: 'Sun', revenue: 3800 }
];

export function Dashboard() {
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        setLoading(true);
        const data = await dashboardApi.getStats();
        setKpis(data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchKPIs();
  }, []);

  const kpiCards = [
    {
      title: 'Open Batches',
      value: kpis?.openBatches || 0,
      icon: PackageOpenIcon,
      color: 'text-zm-teal',
      bg: 'bg-zm-teal-light'
    },
    {
      title: 'Total Available',
      value: kpis?.totalAvailable || 0,
      icon: ArchiveIcon,
      color: 'text-zm-gold',
      bg: 'bg-zm-gold-light'
    },
    {
      title: 'Total Booked',
      value: kpis?.totalBooked || 0,
      icon: ShoppingCartIcon,
      color: 'text-zm-warning',
      bg: 'bg-zm-warning-light'
    },
    {
      title: 'Total Collected',
      value: kpis?.totalCollected || 0,
      icon: CheckCircleIcon,
      color: 'text-zm-success',
      bg: 'bg-zm-success-light'
    },
    {
      title: 'Revenue Collected',
      value: kpis?.revenueCollected || 0,
      prefix: 'KWD ',
      icon: DollarSignIcon,
      color: 'text-zm-success',
      bg: 'bg-zm-success-light'
    },
    {
      title: 'Revenue Pending',
      value: kpis?.revenuePending || 0,
      prefix: 'KWD ',
      icon: ClockIcon,
      color: 'text-zm-warning',
      bg: 'bg-zm-warning-light'
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl text-foreground">
              Dashboard
            </h2>
            <p className="text-muted-foreground mt-1">
              Welcome back. Here's your business at a glance.
            </p>
          </div>
        </div>
        <Card className="p-8">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircleIcon className="h-6 w-6" />
            <p>{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-sm underline text-muted-foreground hover:text-foreground"
          >
            Try Again
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground">
            Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">
            Welcome back. Here's your business at a glance.
          </p>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        {kpiCards.map((kpi, index) => (
          <motion.div key={index} variants={item}>
            <Card hoverable className="p-6 flex items-center space-x-4">
              <div className={`p-4 rounded-full ${kpi.bg} ${kpi.color}`}>
                <kpi.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </p>
                <h3 className="text-2xl font-semibold text-foreground mt-1">
                  {loading ? (
                    <span className="animate-pulse">--</span>
                  ) : (
                    <AnimatedCounter value={kpi.value} prefix={kpi.prefix} />
                  )}
                </h3>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Bookings This Week
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid hsl(var(--border))'
                  }}
                />
                <Bar
                  dataKey="bookings"
                  fill="hsl(174 42% 41%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Revenue Overview
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(152 50% 42%)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(152 50% 42%)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(val) => `KWD ${val}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid hsl(var(--border))'
                  }}
                  formatter={(value) => [`KWD ${value}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(152 50% 42%)"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
