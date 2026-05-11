import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { DssResult } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Info, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function DecisionSupport({
    latestDss,
    history = [],
}: {
    latestDss?: DssResult;
    history: DssResult[];
}) {
    const { flash } = usePage().props as any;

    const [search, setSearch] = useState('');
    const [readinessFilter, setReadinessFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const [infoModal, setInfoModal] = useState<{
        title: string;
        content: string;
    } | null>(null);

   const [itemsPerPage, setItemsPerPage] = useState(10);

    const dssInfo = {
        demandStatus: {
            title: 'How Demand Status Works',
            content:
                'Demand Status explains how high or low the predicted electricity consumption is compared to the normal or average consumption.\n\nHigh Demand means the predicted consumption is at least 15% higher than the average consumption. This tells the user that electricity use may become heavy and may require stronger monitoring or energy-saving actions.\n\nModerate Demand means the predicted consumption is close to the average consumption, usually from 90% up to below 115% of the baseline. This means the electricity demand is still manageable but should continue to be monitored.\n\nLow Demand means the predicted consumption is lower than 90% of the average consumption. This means electricity use is below normal and may indicate lower energy demand for the next period.\n\nFormula used by the system:\nDemand Ratio = Predicted Consumption / Average Consumption',
        },
        readinessLevel: {
            title: 'How Readiness Level Works',
            content:
                'Readiness Level explains how prepared the area or facility is for renewable energy transition based on solar potential and peak demand condition.\n\nHigh Readiness means the system detected good solar irradiance and manageable peak demand. This means the area may be more suitable for renewable energy planning such as solar energy adoption.\n\nModerate Readiness means the area has fair renewable energy potential but may still need monitoring, planning, or gradual implementation before full renewable transition.\n\nLow Readiness means the area may not yet be ready for immediate renewable energy transition. This may happen when solar irradiance is low or peak demand is high compared to the predicted consumption.\n\nThe system gives readiness score based on solar irradiance and peak demand. Higher solar irradiance and lower peak demand increase the readiness level.',
        },
    };

    const filteredHistory = useMemo(() => {
        return history.filter((item) => {
            const demand = item.demand_status?.toLowerCase() ?? '';
            const readiness = item.readiness_level?.toLowerCase() ?? '';
            const generated = new Date(item.created_at).toLocaleString().toLowerCase();

            const matchesSearch =
                demand.includes(search.toLowerCase()) ||
                readiness.includes(search.toLowerCase()) ||
                generated.includes(search.toLowerCase());

            const matchesReadiness =
                readinessFilter === 'all' || item.readiness_level === readinessFilter;

            return matchesSearch && matchesReadiness;
        });
    }, [history, search, readinessFilter]);

    const uniqueReadinessLevels = Array.from(
        new Set(history.map((item) => item.readiness_level).filter(Boolean)),
    );

    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

    const paginatedHistory = filteredHistory.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Decision Support</h1>
                    <p className="text-sm text-muted-foreground">
                        Demand classification, renewable readiness, and recommended actions.
                    </p>
                </div>

                <Button onClick={() => router.post('/admin/decision-support/generate')}>
                    Generate DSS Result
                </Button>
            </div>

            {flash?.success && (
                <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                    {flash.success}
                </div>
            )}

            {flash?.error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                    {flash.error}
                </div>
            )}

            <Card className="rounded-lg">
                <CardHeader>
                    <CardTitle>Latest Assessment</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">
                                Demand Status
                            </p>

                            <button
                                type="button"
                                onClick={() => setInfoModal(dssInfo.demandStatus)}
                                className="rounded-full text-muted-foreground hover:text-black"
                            >
                                <Info className="h-4 w-4" />
                            </button>
                        </div>

                        <p className="text-xl font-semibold">
                            {latestDss?.demand_status ?? 'No result'}
                        </p>

                        <p className="mt-2 text-sm text-muted-foreground">
                            This shows whether the predicted electricity consumption is low,
                            moderate, or high compared to the normal consumption level.
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">
                                Readiness Level
                            </p>

                            <button
                                type="button"
                                onClick={() => setInfoModal(dssInfo.readinessLevel)}
                                className="rounded-full text-muted-foreground hover:text-black"
                            >
                                <Info className="h-4 w-4" />
                            </button>
                        </div>

                        <p className="text-xl font-semibold">
                            {latestDss?.readiness_level ?? 'No result'}
                        </p>

                        <p className="mt-2 text-sm text-muted-foreground">
                            This shows how prepared the area is for renewable energy
                            transition based on solar potential and peak demand.
                        </p>
                    </div>

                    <div>
                        <p className="font-medium">Recommendations</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            These are suggested plans that can help reduce electricity
                            consumption, improve energy monitoring, or support renewable
                            energy transition.
                        </p>

                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                            {latestDss?.recommendations?.map((item) => (
                                <li key={item}>
                                    {item} This recommendation helps the user understand what
                                    action can be considered based on the current demand and
                                    readiness result of the system.
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className="font-medium">Priority Actions</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            These are the actions that should be prioritized first because
                            they directly support decision-making and preparation for energy
                            planning.
                        </p>

                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                            {latestDss?.priority_actions?.map((item) => (
                                <li key={item}>
                                    {item} This action should be prioritized because it can
                                    guide administrators in monitoring consumption, comparing
                                    forecast results, and preparing proper energy management
                                    steps.
                                </li>
                            ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-lg">
                <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <CardTitle>DSS History Table</CardTitle>

                        <div className="flex flex-col gap-2 md:flex-row">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                                <Input
                                    className="w-full pl-9 md:w-64"
                                    placeholder="Search DSS history..."
                                    value={search}
                                    onChange={(event) => {
                                        setSearch(event.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>

                            <select
                                className="rounded-md border bg-background px-3 py-2 text-sm"
                                value={readinessFilter}
                                onChange={(event) => {
                                    setReadinessFilter(event.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="all">All Readiness</option>

                                {uniqueReadinessLevels.map((level) => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="rounded-md border bg-background px-3 py-2 text-sm"
                                value={itemsPerPage}
                                onChange={(event) => {
                                    setItemsPerPage(Number(event.target.value));
                                    setCurrentPage(1);
                                }}
                            >
                                <option value={10}>10</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/40 text-left">
                                <th className="px-3 py-2 font-semibold">Demand Status</th>
                                <th className="px-3 py-2 font-semibold">Readiness Level</th>
                                <th className="px-3 py-2 font-semibold">Generated</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedHistory.length > 0 ? (
                                paginatedHistory.map((item) => (
                                    <tr key={item.id} className="border-b">
                                        <td className="px-3 py-3">
                                            {item.demand_status}
                                        </td>
                                        <td className="px-3 py-3">
                                            {item.readiness_level}
                                        </td>
                                        <td className="px-3 py-3">
                                            {new Date(item.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-3 py-6 text-center text-muted-foreground"
                                    >
                                        No DSS history found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {paginatedHistory.length} of {filteredHistory.length} DSS results
                        </p>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Previous
                            </Button>

                            <span className="text-sm">
                                Page {currentPage} of {totalPages || 1}
                            </span>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === totalPages || totalPages === 0}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!infoModal} onOpenChange={() => setInfoModal(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{infoModal?.title}</DialogTitle>
                    </DialogHeader>

                    <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                        {infoModal?.content}
                    </p>
                </DialogContent>
            </Dialog>
        </div>
    );
}
