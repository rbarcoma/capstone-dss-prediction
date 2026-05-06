import { StatCard } from '@/components/dss/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ForecastResult } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Brain, LineChart, Target } from 'lucide-react';

export default function Forecasting({ latestForecast, forecastHistory = [] }: { latestForecast?: ForecastResult; forecastHistory: ForecastResult[] }) {
    const { flash } = usePage().props as any;

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-semibold">Machine Learning Forecasting</h1>
                    <p className="text-sm text-muted-foreground">Train the model and predict next-month electricity consumption.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.post('/admin/forecasting/train')}>Train Model</Button>
                    <Button onClick={() => router.post('/admin/forecasting/predict')}>Predict Next Month</Button>
                </div>
            </div>

            {flash?.success && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{flash.success}</div>}
            {flash?.error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{flash.error}</div>}

            <div className="grid gap-4 md:grid-cols-3">
                <StatCard title="Latest Prediction" value={`${latestForecast?.predicted_consumption_kwh ?? 0} kWh`} icon={Brain} />
                <StatCard title="MAE" value={latestForecast?.mae ?? 'Pending'} icon={Target} />
                <StatCard title="R2 Score" value={latestForecast?.r2_score ?? 'Pending'} icon={LineChart} />
            </div>

            <Card className="rounded-lg">
                <CardHeader><CardTitle>Forecast History</CardTitle></CardHeader>
                <CardContent className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead><tr className="border-b text-left"><th className="py-2">Period</th><th>Prediction</th><th>Change</th><th>RMSE</th><th>Model</th></tr></thead>
                        <tbody>{forecastHistory.map((item) => (
                            <tr key={item.id} className="border-b">
                                <td className="py-2">{item.year}-{String(item.month).padStart(2, '0')}</td>
                                <td>{item.predicted_consumption_kwh} kWh</td>
                                <td>{item.change_percent ?? 0}%</td>
                                <td>{item.rmse ?? '-'}</td>
                                <td>{item.model_type}</td>
                            </tr>
                        ))}</tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
