import { StatCard } from '@/components/dss/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

function formatChartData(data: any[]) {
    return data.map((item) => ({
        label:
            item.label ??
            item.period ??
            item.month ??
            item.year ??
            `${item.year ?? ''}-${String(item.month ?? '').padStart(2, '0')}`,
        value:
            item.value ??
            item.consumption_kwh ??
            item.average_consumption ??
            item.total_consumption ??
            item.predicted_consumption_kwh ??
            0,
    }));
}

function AnalyticsChart({
    data,
    gradientId,
}: {
    data: any[];
    gradientId: string;
}) {
    const chartData = formatChartData(data);
    const tooltipStyle = {
        backgroundColor: 'var(--popover)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        color: 'var(--popover-foreground)',
    };

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{ top: 12, right: 18, left: 4, bottom: 8 }}
                >
                    <defs>
                        <linearGradient
                            id={gradientId}
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
                        dataKey="label"
                        axisLine={{ stroke: 'var(--border)' }}
                        tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                        tickLine={false}
                        tickMargin={10}
                    />
                    <YAxis
                        axisLine={{ stroke: 'var(--border)' }}
                        tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                        tickLine={false}
                    />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#059669"
                        strokeWidth={3}
                        fill={`url(#${gradientId})`}
                        dot={{ r: 3, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export default function Analytics({
    monthlyTrend = [],
    yearlyComparison = [],
    seasonalPattern = [],
    summary = {},
}: any) {
    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-semibold">Analytics</h1>
                <p className="text-sm text-muted-foreground">
                    View-only electricity consumption analytics.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <StatCard
                    title="Average Consumption"
                    value={`${summary.average_consumption ?? 0} kWh`}
                />
                <StatCard
                    title="Highest Consumption"
                    value={`${summary.highest_consumption ?? 0} kWh`}
                />
                <StatCard
                    title="Average Peak Demand"
                    value={`${summary.average_peak_demand ?? 0} kW`}
                />
                <StatCard
                    title="Avg Solar Irradiance"
                    value={summary.average_solar_irradiance ?? 0}
                />
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
                <Card className="rounded-lg">
                    <CardHeader>
                        <CardTitle>Historical Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AnalyticsChart
                            data={monthlyTrend}
                            gradientId="userHistoricalTrend"
                        />
                    </CardContent>
                </Card>

                <Card className="rounded-lg">
                    <CardHeader>
                        <CardTitle>Yearly Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AnalyticsChart
                            data={yearlyComparison}
                            gradientId="userYearlyComparison"
                        />
                    </CardContent>
                </Card>

                <Card className="rounded-lg xl:col-span-2">
                    <CardHeader>
                        <CardTitle>Seasonal Patterns</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AnalyticsChart
                            data={seasonalPattern}
                            gradientId="userSeasonalPatterns"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
