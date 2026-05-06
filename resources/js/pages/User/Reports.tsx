import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Report } from '@/types';
import { Link } from '@inertiajs/react';

export default function Reports({ reports = [] }: { reports: Report[] }) {
    return (
        <div className="space-y-6 p-6">
            <div><h1 className="text-2xl font-semibold">Reports</h1><p className="text-sm text-muted-foreground">View, download, and print generated reports.</p></div>
            <Card className="rounded-lg"><CardHeader><CardTitle>Available Reports</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full text-sm"><tbody>{reports.map((report) => <tr key={report.id} className="border-b"><td className="py-2">{report.title}</td><td>{report.type}</td><td className="text-right"><Button asChild size="sm" variant="outline"><Link href={`/reports/${report.id}/download`}>Open / Print</Link></Button></td></tr>)}</tbody></table></CardContent></Card>
        </div>
    );
}
