import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DssResult } from '@/types';

export default function DecisionSupportResults({ latestDss }: { latestDss?: DssResult }) {
    return (
        <div className="space-y-6 p-6">
            <div><h1 className="text-2xl font-semibold">Decision Support Results</h1><p className="text-sm text-muted-foreground">View-only demand status, readiness assessment, recommendations, and priority actions.</p></div>
            <Card className="rounded-lg"><CardHeader><CardTitle>Latest DSS Assessment</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><div><p className="text-sm text-muted-foreground">Demand Status</p><p className="text-xl font-semibold">{latestDss?.demand_status ?? 'No result'}</p></div><div><p className="text-sm text-muted-foreground">Readiness Level</p><p className="text-xl font-semibold">{latestDss?.readiness_level ?? 'No result'}</p></div><div><p className="font-medium">Recommendations</p><ul className="mt-2 list-disc pl-5 text-sm">{latestDss?.recommendations?.map((item) => <li key={item}>{item}</li>)}</ul></div><div><p className="font-medium">Priority Actions</p><ul className="mt-2 list-disc pl-5 text-sm">{latestDss?.priority_actions?.map((item) => <li key={item}>{item}</li>)}</ul></div></CardContent></Card>
        </div>
    );
}
