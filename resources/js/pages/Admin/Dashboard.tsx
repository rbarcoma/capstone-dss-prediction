import { StatCard } from '@/components/dss/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ForecastResult, Report } from '@/types';
import {
    Activity,
    BarChart3,
    Brain,
    Database,
    FileText,
    Layers,
    LineChart,
} from 'lucide-react';
import {
    CartesianGrid,
    Line,
    LineChart as RechartsLineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

function formatChartData(data: any[]) {
    return data.map((item) => ({
        label: `${item.year}-${String(item.month).padStart(2, '0')}`,
        value: item.consumption_kwh ?? 0,
    }));
}

function DashboardChart({ data }: { data: any[] }) {
    const chartData = formatChartData(data);
    const axisColor = 'var(--muted-foreground)';
    const borderColor = 'var(--border)';
    const tooltipStyle = {
        backgroundColor: 'var(--popover)',
        border: '1px solid var(--border)',
        color: 'var(--popover-foreground)',
    };

    return (
        <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
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
                        stroke="#16a34a"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </RechartsLineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default function Dashboard({
    stats,
    recentForecasts = [],
    recentReports = [],
    trend = [],
}: {
    stats: Record<string, number | string>;
    recentForecasts: ForecastResult[];
    recentReports: Report[];
    trend: { year: number; month: number; consumption_kwh: number }[];
}) {
    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-semibold">
                    Renewable Energy DSS Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                    Quezon City electricity analytics, forecasting, and transition readiness.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Latest Consumption"
                    value={`${stats.latest_average_consumption ?? 0} kWh`}
                    icon={Activity}
                />

                <StatCard
                    title="Predicted Consumption"
                    value={`${stats.latest_predicted_consumption ?? 0} kWh`}
                    icon={Brain}
                />

                <StatCard
                    title="Demand Status"
                    value={stats.demand_status ?? 'No data'}
                    icon={BarChart3}
                />

                <StatCard
                    title="Readiness Level"
                    value={stats.readiness_level ?? 'No data'}
                    icon={FileText}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <StatCard title="Datasets" value={stats.datasets ?? 0} icon={Database} />
                <StatCard title="Processed Records" value={stats.processed_records ?? 0} icon={Layers} />
                <StatCard title="Forecasts" value={stats.forecasts ?? 0} icon={LineChart} />
                <StatCard title="Reports" value={stats.reports ?? 0} icon={FileText} />
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
                <Card className="rounded-lg">
                    <CardHeader>
                        <CardTitle>Monthly Consumption Trend</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <DashboardChart data={trend} />
                    </CardContent>
                </Card>

                <Card className="rounded-lg">
                    <CardHeader>
                        <CardTitle>Recent Forecasts</CardTitle>
                    </CardHeader>

                    <CardContent className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/40 text-left">
                                    <th className="px-3 py-2 font-semibold">Period</th>
                                    <th className="px-3 py-2 text-right font-semibold">
                                        Prediction
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentForecasts.length > 0 ? (
                                    recentForecasts.map((item) => (
                                        <tr key={item.id} className="border-b">
                                            <td className="px-3 py-2">
                                                {item.year}-{String(item.month).padStart(2, '0')}
                                            </td>
                                            <td className="px-3 py-2 text-right">
                                                {item.predicted_consumption_kwh} kWh
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={2}
                                            className="px-3 py-6 text-center text-muted-foreground"
                                        >
                                            No recent forecasts found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>

            <Card className="rounded-lg">
                <CardHeader>
                    <CardTitle>Recent Reports</CardTitle>
                </CardHeader>

                <CardContent className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/40 text-left">
                                <th className="px-3 py-2 font-semibold">Title</th>
                                <th className="px-3 py-2 font-semibold">Type</th>
                                <th className="px-3 py-2 font-semibold">Generated</th>
                            </tr>
                        </thead>

                        <tbody>
                            {recentReports.length > 0 ? (
                                recentReports.map((report) => (
                                    <tr key={report.id} className="border-b">
                                        <td className="px-3 py-2">{report.title}</td>
                                        <td className="px-3 py-2">{report.type}</td>
                                        <td className="px-3 py-2">
                                            {new Date(report.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-3 py-6 text-center text-muted-foreground"
                                    >
                                        No recent reports found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
