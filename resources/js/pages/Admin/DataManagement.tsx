import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { router, useForm, usePage } from '@inertiajs/react';
import type { Dataset } from '@/types';

export default function DataManagement({ datasets = [], requiredColumns }: { datasets: Dataset[]; requiredColumns: Record<string, string[]> }) {
    const { flash } = usePage().props as any;
    const { data, setData, post, processing } = useForm<{ type: string; dataset: File | null; replace_existing: boolean }>({
        type: 'electricity',
        dataset: null,
        replace_existing: false,
    });

    return (
        <div className="space-y-6 p-6">
            <div><h1 className="text-2xl font-semibold">Data Management</h1><p className="text-sm text-muted-foreground">Upload, validate, replace, and review electricity and climate datasets.</p></div>
            {flash?.success && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{flash.success}</div>}
            {flash?.error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{flash.error}</div>}

            <Card className="rounded-lg">
                <CardHeader><CardTitle>Upload Dataset</CardTitle></CardHeader>
                <CardContent>
                    <form className="grid gap-4 md:grid-cols-4" onSubmit={(event) => { event.preventDefault(); post('/admin/data-management'); }}>
                        <select className="rounded-md border bg-background px-3 py-2 text-sm" value={data.type} onChange={(event) => setData('type', event.target.value)}>
                            <option value="electricity">Electricity Consumption</option>
                            <option value="climate">Climate</option>
                        </select>
                        <Input type="file" accept=".csv,text/csv" onChange={(event) => setData('dataset', event.target.files?.[0] ?? null)} />
                        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.replace_existing} onChange={(event) => setData('replace_existing', event.target.checked)} /> Replace existing records</label>
                        <Button disabled={processing}>Upload CSV</Button>
                    </form>
                    <p className="mt-3 text-xs text-muted-foreground">Required columns: {requiredColumns[data.type]?.join(', ')}</p>
                </CardContent>
            </Card>

            <Card className="rounded-lg">
                <CardHeader><CardTitle>Uploaded Datasets</CardTitle></CardHeader>
                <CardContent className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead><tr className="border-b text-left"><th className="py-2">File</th><th>Type</th><th>Status</th><th>Records</th><th></th></tr></thead>
                        <tbody>{datasets.map((item) => (
                            <tr key={item.id} className="border-b">
                                <td className="py-2">{item.original_name}</td><td>{item.type}</td><td>{item.status}</td><td>{item.record_count}</td>
                                <td className="text-right"><Button variant="destructive" size="sm" onClick={() => router.delete(`/admin/data-management/${item.id}`)}>Delete</Button></td>
                            </tr>
                        ))}</tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
