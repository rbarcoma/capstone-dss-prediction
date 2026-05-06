import { SimpleChart } from '@/components/dss/simple-chart';
import { StatCard } from '@/components/dss/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ForecastResult, Report } from '@/types';
import { Activity, BarChart3, Brain, FileText } from 'lucide-react';

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
                <h1 className="text-2xl font-semibold">Renewable Energy DSS Dashboard</h1>
                <p className="text-sm text-muted-foreground">Quezon City electricity analytics, forecasting, and transition readiness.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard title="Latest Consumption" value={`${stats.latest_average_consumption ?? 0} kWh`} icon={Activity} />
                <StatCard title="Predicted Consumption" value={`${stats.latest_predicted_consumption ?? 0} kWh`} icon={Brain} />
                <StatCard title="Demand Status" value={stats.demand_status ?? 'No data'} icon={BarChart3} />
                <StatCard title="Readiness Level" value={stats.readiness_level ?? 'No data'} icon={FileText} />
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <StatCard title="Datasets" value={stats.datasets ?? 0} />
                <StatCard title="Processed Records" value={stats.processed_records ?? 0} />
                <StatCard title="Forecasts" value={stats.forecasts ?? 0} />
                <StatCard title="Reports" value={stats.reports ?? 0} />
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
                <Card className="rounded-lg">
                    <CardHeader><CardTitle>Monthly Consumption Trend</CardTitle></CardHeader>
                    <CardContent><SimpleChart data={trend} /></CardContent>
                </Card>
                <Card className="rounded-lg">
                    <CardHeader><CardTitle>Recent Forecasts</CardTitle></CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <tbody>{recentForecasts.map((item) => (
                                <tr key={item.id} className="border-b">
                                    <td className="py-2">{item.year}-{String(item.month).padStart(2, '0')}</td>
                                    <td className="py-2 text-right">{item.predicted_consumption_kwh} kWh</td>
                                </tr>
                            ))}</tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>

            <Card className="rounded-lg">
                <CardHeader><CardTitle>Recent Reports</CardTitle></CardHeader>
                <CardContent>
                    <div className="grid gap-2 md:grid-cols-2">{recentReports.map((report) => (
                        <div key={report.id} className="rounded-md border p-3 text-sm">{report.title}</div>
                    ))}</div>
                </CardContent>
            </Card>
        </div>
    );
}
