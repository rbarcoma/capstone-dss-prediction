import { StatCard } from '@/components/dss/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    CartesianGrid,
    Line,
    LineChart,
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

function AnalyticsChart({ data }: { data: any[] }) {
    const chartData = formatChartData(data);
    const axisColor = 'var(--muted-foreground)';
    const borderColor = 'var(--border)';
    const tooltipStyle = {
        backgroundColor: 'var(--popover)',
        border: '1px solid var(--border)',
        color: 'var(--popover-foreground)',
    };

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
                    <XAxis
                        dataKey="label"
                        tick={{ fontSize: 12, fill: axisColor }}
                        tickMargin={10}
                        axisLine={{ stroke: borderColor }}
                        tickLine={{ stroke: borderColor }}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: axisColor }}
                        tickMargin={10}
                        axisLine={{ stroke: borderColor }}
                        tickLine={{ stroke: borderColor }}
                    />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#059669"
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
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
                        <AnalyticsChart data={monthlyTrend} />
                    </CardContent>
                </Card>

                <Card className="rounded-lg">
                    <CardHeader>
                        <CardTitle>Yearly Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AnalyticsChart data={yearlyComparison} />
                    </CardContent>
                </Card>

                <Card className="rounded-lg xl:col-span-2">
                    <CardHeader>
                        <CardTitle>Seasonal Patterns</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AnalyticsChart data={seasonalPattern} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
