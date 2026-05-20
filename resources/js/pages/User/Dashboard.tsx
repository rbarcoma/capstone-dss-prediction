import { StatCard } from '@/components/dss/stat-card';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ForecastResult } from '@/types';
import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    Brain,
    CalendarDays,
    CheckCircle2,
    Lightbulb,
    LineChart,
    ListChecks,
    Sun,
    Zap,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

type DashboardStats = {
    latest_average_consumption?: number;
    latest_predicted_consumption?: number;
    latest_period?: string;
    forecast_period?: string;
    forecast_change_percent?: number;
    previous_consumption?: number;
    peak_demand_kw?: number;
    solar_irradiance?: number;
    demand_status?: string;
    readiness_level?: string;
};

type TrendPoint = {
    year: number;
    month: number;
    consumption_kwh: number;
    peak_demand_kw?: number;
    solar_irradiance?: number;
};

function formatNumber(value?: number | string) {
    return Number(value ?? 0).toLocaleString(undefined, {
        maximumFractionDigits: 2,
    });
}

function formatPeriod(year?: number, month?: number) {
    if (!year || !month) {
        return '-';
    }

    return `${year}-${String(month).padStart(2, '0')}`;
}

function chartData(data: TrendPoint[]) {
    return data.map((item) => ({
        period: formatPeriod(item.year, item.month),
        consumption: Number(item.consumption_kwh ?? 0),
        peakDemand: Number(item.peak_demand_kw ?? 0),
        solar: Number(item.solar_irradiance ?? 0),
    }));
}

function statusClass(status?: string) {
    const normalized = status?.toLowerCase() ?? '';

    if (normalized.includes('high')) {
        return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    }

    if (normalized.includes('low')) {
        return 'border-red-200 bg-red-50 text-red-700';
    }

    return 'border-amber-200 bg-amber-50 text-amber-700';
}

function ConsumptionTrendChart({ data }: { data: TrendPoint[] }) {
    const prepared = chartData(data);

    return (
        <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={prepared}
                    margin={{ top: 12, right: 18, left: 4, bottom: 8 }}
                >
                    <defs>
                        <linearGradient
                            id="consumptionGradient"
                            x1="0"
                            x2="0"
                            y1="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#059669"
                                stopOpacity={0.28}
                            />
                            <stop
                                offset="95%"
                                stopColor="#059669"
                                stopOpacity={0.02}
                            />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        stroke="var(--border)"
                        strokeDasharray="3 3"
                    />
                    <XAxis
                        dataKey="period"
                        axisLine={{ stroke: 'var(--border)' }}
                        tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                        tickLine={{ stroke: 'var(--border)' }}
                        tickMargin={10}
                    />
                    <YAxis
                        axisLine={{ stroke: 'var(--border)' }}
                        tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                        tickFormatter={(value) => `${Number(value) / 1000}k`}
                        tickLine={{ stroke: 'var(--border)' }}
                        tickMargin={8}
                    />
                    <Tooltip
                        formatter={(value: number) => [
                            `${formatNumber(value)} kWh`,
                            'Consumption',
                        ]}
                        labelFormatter={(label) => `Period ${label}`}
                        contentStyle={{
                            backgroundColor: 'var(--popover)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            color: 'var(--popover-foreground)',
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="consumption"
                        stroke="#059669"
                        strokeWidth={3}
                        fill="url(#consumptionGradient)"
                        dot={{ r: 3, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

function EnergyConditionChart({ data }: { data: TrendPoint[] }) {
    const prepared = chartData(data).slice(-6);

    return (
        <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={prepared}
                    margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
                >
                    <CartesianGrid
                        stroke="var(--border)"
                        strokeDasharray="3 3"
                    />
                    <XAxis
                        dataKey="period"
                        axisLine={{ stroke: 'var(--border)' }}
                        tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                        tickLine={false}
                    />
                    <YAxis
                        axisLine={false}
                        tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--popover)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            color: 'var(--popover-foreground)',
                        }}
                    />
                    <Bar
                        dataKey="peakDemand"
                        name="Peak Demand"
                        fill="#2563eb"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="solar"
                        name="Solar Irradiance"
                        fill="#f59e0b"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default function Dashboard({
    stats,
    recommendations = [],
    priorityActions = [],
    forecastHistory = [],
    trend = [],
}: {
    stats: DashboardStats;
    recommendations: string[];
    priorityActions: string[];
    forecastHistory: ForecastResult[];
    trend: TrendPoint[];
}) {
    const forecastChange = Number(stats.forecast_change_percent ?? 0);
    const changeIsIncrease = forecastChange >= 0;
    const ChangeIcon = changeIsIncrease ? ArrowUpRight : ArrowDownRight;

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Decision-Maker Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Current electricity status, next-month forecast, and
                        renewable transition guidance.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Badge
                        variant="outline"
                        className={statusClass(stats.demand_status)}
                    >
                        <Zap className="size-3" />
                        {stats.demand_status ?? 'No DSS result'}
                    </Badge>
                    <Badge
                        variant="outline"
                        className={statusClass(stats.readiness_level)}
                    >
                        <CheckCircle2 className="size-3" />
                        {stats.readiness_level ?? 'No assessment'}
                    </Badge>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Current Consumption"
                    value={`${formatNumber(stats.latest_average_consumption)} kWh`}
                    helper={stats.latest_period}
                    icon={Activity}
                />
                <StatCard
                    title="Next-Month Forecast"
                    value={`${formatNumber(stats.latest_predicted_consumption)} kWh`}
                    helper={stats.forecast_period}
                    icon={Brain}
                />
                <StatCard
                    title="Forecast Change"
                    value={`${changeIsIncrease ? '+' : ''}${formatNumber(forecastChange)}%`}
                    helper="vs previous month"
                    icon={ChangeIcon}
                />
                <StatCard
                    title="Solar Irradiance"
                    value={formatNumber(stats.solar_irradiance)}
                    helper="latest record"
                    icon={Sun}
                />
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
                <Card className="rounded-lg">
                    <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                        <div>
                            <CardTitle>Monthly Consumption Trend</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Latest 24 monthly records, shown from oldest to
                                newest.
                            </p>
                        </div>
                        <Badge variant="secondary">
                            <LineChart className="size-3" />
                            kWh
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <ConsumptionTrendChart data={trend} />
                    </CardContent>
                </Card>

                <Card className="rounded-lg">
                    <CardHeader>
                        <CardTitle>Planning Snapshot</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-md border p-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CalendarDays className="size-4" />
                                Forecast Period
                            </div>
                            <p className="mt-2 text-2xl font-semibold">
                                {stats.forecast_period ?? 'No forecast'}
                            </p>
                        </div>
                        <div className="rounded-md border p-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <BarChart3 className="size-4" />
                                Peak Demand
                            </div>
                            <p className="mt-2 text-2xl font-semibold">
                                {formatNumber(stats.peak_demand_kw)} kW
                            </p>
                        </div>
                        <div className="rounded-md border p-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Activity className="size-4" />
                                Previous Consumption
                            </div>
                            <p className="mt-2 text-2xl font-semibold">
                                {formatNumber(stats.previous_consumption)} kWh
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
                <Card className="rounded-lg xl:col-span-2">
                    <CardHeader>
                        <CardTitle>Peak Demand and Solar Condition</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <EnergyConditionChart data={trend} />
                    </CardContent>
                </Card>

                <Card className="rounded-lg">
                    <CardHeader>
                        <CardTitle>Recent Forecasts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {forecastHistory.length > 0 ? (
                            forecastHistory.slice(0, 5).map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {formatPeriod(
                                                item.year,
                                                item.month,
                                            )}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.model_type ?? 'Forecast'}
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold">
                                        {formatNumber(
                                            item.predicted_consumption_kwh,
                                        )}{' '}
                                        kWh
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="py-6 text-center text-sm text-muted-foreground">
                                No recent forecasts found.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
                <Card className="rounded-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="size-5 text-emerald-600" />
                            Summary Recommendations
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3 text-sm leading-relaxed">
                            {recommendations.length > 0 ? (
                                recommendations.map((item) => (
                                    <li
                                        key={item}
                                        className="rounded-md border-l-4 border-emerald-500 bg-muted/30 p-3"
                                    >
                                        {item}
                                    </li>
                                ))
                            ) : (
                                <li className="text-muted-foreground">
                                    No recommendations available yet.
                                </li>
                            )}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="rounded-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ListChecks className="size-5 text-blue-600" />
                            Priority Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3 text-sm leading-relaxed">
                            {priorityActions.length > 0 ? (
                                priorityActions.map((item) => (
                                    <li
                                        key={item}
                                        className="rounded-md border-l-4 border-blue-500 bg-muted/30 p-3"
                                    >
                                        {item}
                                    </li>
                                ))
                            ) : (
                                <li className="text-muted-foreground">
                                    No priority actions available yet.
                                </li>
                            )}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
