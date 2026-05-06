import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DssResult } from '@/types';
import { router, usePage } from '@inertiajs/react';

export default function DecisionSupport({ latestDss, history = [] }: { latestDss?: DssResult; history: DssResult[] }) {
    const { flash } = usePage().props as any;
    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center"><div><h1 className="text-2xl font-semibold">Decision Support</h1><p className="text-sm text-muted-foreground">Demand classification, renewable readiness, and recommended actions.</p></div><Button onClick={() => router.post('/admin/decision-support/generate')}>Generate DSS Result</Button></div>
            {flash?.success && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{flash.success}</div>}
            {flash?.error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{flash.error}</div>}
            <Card className="rounded-lg"><CardHeader><CardTitle>Latest Assessment</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><div><p className="text-sm text-muted-foreground">Demand Status</p><p className="text-xl font-semibold">{latestDss?.demand_status ?? 'No result'}</p></div><div><p className="text-sm text-muted-foreground">Readiness Level</p><p className="text-xl font-semibold">{latestDss?.readiness_level ?? 'No result'}</p></div><div><p className="font-medium">Recommendations</p><ul className="mt-2 list-disc pl-5 text-sm">{latestDss?.recommendations?.map((item) => <li key={item}>{item}</li>)}</ul></div><div><p className="font-medium">Priority Actions</p><ul className="mt-2 list-disc pl-5 text-sm">{latestDss?.priority_actions?.map((item) => <li key={item}>{item}</li>)}</ul></div></CardContent></Card>
            <Card className="rounded-lg"><CardHeader><CardTitle>DSS History</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full text-sm"><tbody>{history.map((item) => <tr key={item.id} className="border-b"><td className="py-2">{item.demand_status}</td><td>{item.readiness_level}</td><td>{new Date(item.created_at).toLocaleString()}</td></tr>)}</tbody></table></CardContent></Card>
        </div>
    );
}
