import { SimpleChart } from '@/components/dss/simple-chart';
import { StatCard } from '@/components/dss/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Analytics({ monthlyTrend = [], yearlyComparison = [], seasonalPattern = [], summary }: any) {
    return (
        <div className="space-y-6 p-6">
            <div><h1 className="text-2xl font-semibold">Analytics</h1><p className="text-sm text-muted-foreground">View-only electricity consumption analytics.</p></div>
            <div className="grid gap-4 md:grid-cols-4"><StatCard title="Average Consumption" value={`${summary.average_consumption} kWh`} /><StatCard title="Highest Consumption" value={`${summary.highest_consumption} kWh`} /><StatCard title="Average Peak Demand" value={`${summary.average_peak_demand} kW`} /><StatCard title="Avg Solar Irradiance" value={summary.average_solar_irradiance} /></div>
            <div className="grid gap-4 xl:grid-cols-2"><Card className="rounded-lg"><CardHeader><CardTitle>Historical Trend</CardTitle></CardHeader><CardContent><SimpleChart data={monthlyTrend} /></CardContent></Card><Card className="rounded-lg"><CardHeader><CardTitle>Yearly Comparison</CardTitle></CardHeader><CardContent><SimpleChart data={yearlyComparison} /></CardContent></Card><Card className="rounded-lg xl:col-span-2"><CardHeader><CardTitle>Seasonal Patterns</CardTitle></CardHeader><CardContent><SimpleChart data={seasonalPattern} /></CardContent></Card></div>
        </div>
    );
}
