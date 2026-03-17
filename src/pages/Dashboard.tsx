import { useEffect, useState, useCallback } from 'react';
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
  AlertCircleIcon,
  RefreshCwIcon,
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
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const PIE_COLORS = [
  'hsl(174 42% 41%)',
  'hsl(152 50% 42%)',
  'hsl(43 96% 56%)',
  'hsl(210 79% 46%)',
  'hsl(340 75% 55%)',
  'hsl(271 76% 53%)',
];

const isDev = (import.meta as any)?.env?.DEV === true;

export function Dashboard() {
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadStats = useCallback(async () => {
    try {
      const data = await dashboardApi.getStats();
      setKpis(data);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load dashboard data');
      if (isDev) console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 60_000);
    return () => clearInterval(interval);
  }, [loadStats]);

  const kpiCards = [
    {
      title: 'Open Batches',
      value: kpis?.openBatches || 0,
      icon: PackageOpenIcon,
      color: 'text-zm-teal',
      bg: 'bg-zm-teal-light',
    },
    {
      title: 'Total Available',
      value: kpis?.totalAvailable || 0,
      icon: ArchiveIcon,
      color: 'text-zm-gold',
      bg: 'bg-zm-gold-light',
    },
    {
      title: 'Total Booked',
      value: kpis?.totalBooked || 0,
      icon: ShoppingCartIcon,
      color: 'text-zm-warning',
      bg: 'bg-zm-warning-light',
    },
    {
      title: 'Total Collected',
      value: kpis?.totalCollected || 0,
      icon: CheckCircleIcon,
      color: 'text-zm-success',
      bg: 'bg-zm-success-light',
    },
    {
      title: 'Revenue Collected',
      value: kpis?.revenueCollected || 0,
      prefix: 'KWD ',
      icon: DollarSignIcon,
      color: 'text-zm-success',
      bg: 'bg-zm-success-light',
    },
    {
      title: 'Revenue Pending',
      value: kpis?.revenuePending || 0,
      prefix: 'KWD ',
      icon: ClockIcon,
      color: 'text-zm-warning',
      bg: 'bg-zm-warning-light',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  if (error && !kpis) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground">Dashboard</h2>
          <p className="text-muted-foreground mt-1">Welcome back. Here's your business at a glance.</p>
        </div>
        <Card className="p-8">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircleIcon className="h-6 w-6" />
            <p>{error}</p>
          </div>
          <button
            onClick={loadStats}
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
          <h2 className="font-heading text-3xl md:text-4xl text-foreground">Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Welcome back. Here's your business at a glance.
            {lastUpdated && (
              <span className="ml-2 text-xs opacity-60">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={loadStats}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          title="Refresh data"
        >
          <RefreshCwIcon className="h-3.5 w-3.5" />
          Refresh
        </button>
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
                <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
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
        {/* Monthly bookings bar chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Monthly Bookings</h3>
          <div className="h-72 w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground text-sm">Loading chart...</div>
              </div>
            ) : (kpis?.monthlyBookings || []).length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                No booking data yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kpis?.monthlyBookings || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid hsl(var(--border))',
                      background: 'hsl(var(--card))',
                    }}
                  />
                  <Bar dataKey="bookings" fill="hsl(174 42% 41%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Revenue area chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Revenue Overview</h3>
          <div className="h-72 w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground text-sm">Loading chart...</div>
              </div>
            ) : (kpis?.monthlyBookings || []).length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                No revenue data yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kpis?.monthlyBookings || []}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(152 50% 42%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(152 50% 42%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    tickFormatter={(val) => `KWD ${val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid hsl(var(--border))',
                      background: 'hsl(var(--card))',
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
            )}
          </div>
        </Card>
      </div>

      {/* Product breakdown pie */}
      {(kpis?.productBreakdown || []).length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Bookings by Product</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={kpis?.productBreakdown || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="count"
                  nameKey="product"
                  label={({ product, percent }: { product: string; percent: number }) =>
                    `${product} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {(kpis?.productBreakdown || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid hsl(var(--border))',
                    background: 'hsl(var(--card))',
                  }}
                  formatter={(value) => [value, 'Bookings']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}