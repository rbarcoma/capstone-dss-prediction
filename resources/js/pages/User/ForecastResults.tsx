import { StatCard } from '@/components/dss/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ForecastResult } from '@/types';

export default function ForecastResults({ latestForecast, forecastHistory = [] }: { latestForecast?: ForecastResult; forecastHistory: ForecastResult[] }) {
    return (
        <div className="space-y-6 p-6">
            <div><h1 className="text-2xl font-semibold">Forecast Results</h1><p className="text-sm text-muted-foreground">Next-month consumption prediction and forecast history.</p></div>
            <div className="grid gap-4 md:grid-cols-3"><StatCard title="Predicted Consumption" value={`${latestForecast?.predicted_consumption_kwh ?? 0} kWh`} /><StatCard title="Possible Change" value={`${latestForecast?.change_percent ?? 0}%`} /><StatCard title="Model" value={latestForecast?.model_type ?? 'No model'} /></div>
            <Card className="rounded-lg"><CardHeader><CardTitle>Forecast History</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full text-sm"><tbody>{forecastHistory.map((item) => <tr key={item.id} className="border-b"><td className="py-2">{item.year}-{String(item.month).padStart(2, '0')}</td><td>{item.predicted_consumption_kwh} kWh</td><td>{item.change_percent ?? 0}%</td></tr>)}</tbody></table></CardContent></Card>
        </div>
    );
}
