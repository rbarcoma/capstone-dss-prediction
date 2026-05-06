import { SimpleChart } from '@/components/dss/simple-chart';
import { StatCard } from '@/components/dss/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard({ stats, recommendations = [], trend = [] }: any) {
    return (
        <div className="space-y-6 p-6">
            <div><h1 className="text-2xl font-semibold">Decision-Maker Dashboard</h1><p className="text-sm text-muted-foreground">Current electricity status, next-month forecast, and renewable transition guidance.</p></div>
            <div className="grid gap-4 md:grid-cols-4"><StatCard title="Current Consumption" value={`${stats.latest_average_consumption} kWh`} /><StatCard title="Next-Month Forecast" value={`${stats.latest_predicted_consumption} kWh`} /><StatCard title="Demand Status" value={stats.demand_status} /><StatCard title="Readiness Level" value={stats.readiness_level} /></div>
            <div className="grid gap-4 xl:grid-cols-2">
                <Card className="rounded-lg"><CardHeader><CardTitle>Historical Trend</CardTitle></CardHeader><CardContent><SimpleChart data={trend} /></CardContent></Card>
                <Card className="rounded-lg"><CardHeader><CardTitle>Summary Recommendations</CardTitle></CardHeader><CardContent><ul className="list-disc space-y-2 pl-5 text-sm">{recommendations.map((item: string) => <li key={item}>{item}</li>)}</ul></CardContent></Card>
            </div>
        </div>
    );
}
