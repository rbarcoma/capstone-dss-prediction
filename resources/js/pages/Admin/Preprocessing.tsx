import { StatCard } from '@/components/dss/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProcessedRecord } from '@/types';
import { router, usePage } from '@inertiajs/react';

export default function Preprocessing({ processedRecords = [], counts }: { processedRecords: ProcessedRecord[]; counts: Record<string, number> }) {
    const { flash } = usePage().props as any;
    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div><h1 className="text-2xl font-semibold">Data Preprocessing</h1><p className="text-sm text-muted-foreground">Merge records, clean missing values, sort dates, and generate ML features.</p></div>
                <Button onClick={() => router.post('/admin/data-preprocessing/run')}>Run Preprocessing</Button>
            </div>
            {flash?.success && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{flash.success}</div>}
            {flash?.error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{flash.error}</div>}
            <div className="grid gap-4 md:grid-cols-3"><StatCard title="Consumption Records" value={counts.consumption} /><StatCard title="Climate Records" value={counts.climate} /><StatCard title="Processed Records" value={counts.processed} /></div>
            <Card className="rounded-lg"><CardHeader><CardTitle>Processed Dataset Preview</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left"><th className="py-2">Period</th><th>kWh</th><th>Temp</th><th>Solar</th><th>Peak kW</th></tr></thead><tbody>{processedRecords.map((item) => <tr key={item.id} className="border-b"><td className="py-2">{item.year}-{String(item.month).padStart(2, '0')}</td><td>{item.consumption_kwh}</td><td>{item.temperature}</td><td>{item.solar_irradiance}</td><td>{item.peak_demand_kw}</td></tr>)}</tbody></table></CardContent></Card>
        </div>
    );
}
