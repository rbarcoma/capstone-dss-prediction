import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Report } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';

export default function Reports({ reports = [] }: { reports: Report[] }) {
    const { flash } = usePage().props as any;
    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center"><div><h1 className="text-2xl font-semibold">Report Management</h1><p className="text-sm text-muted-foreground">Generate, print, and download analytics, forecast, and DSS reports.</p></div><Button onClick={() => router.post('/admin/reports')}>Generate Report</Button></div>
            {flash?.success && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{flash.success}</div>}
            <Card className="rounded-lg"><CardHeader><CardTitle>Report History</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left"><th className="py-2">Title</th><th>Type</th><th>Generated</th><th></th></tr></thead><tbody>{reports.map((report) => <tr key={report.id} className="border-b"><td className="py-2">{report.title}</td><td>{report.type}</td><td>{new Date(report.created_at).toLocaleString()}</td><td className="text-right"><Button asChild size="sm" variant="outline"><Link href={`/reports/${report.id}/download`}>Open / Print</Link></Button></td></tr>)}</tbody></table></CardContent></Card>
        </div>
    );
}
