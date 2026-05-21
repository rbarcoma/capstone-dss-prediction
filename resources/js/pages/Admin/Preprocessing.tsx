import { StatCard } from '@/components/dss/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { ProcessedRecord } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Activity, CloudSun, Database, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

type RecordInfo = {
    title: string;
    description: string;
    points: string[];
};

const recordInfo: Record<string, RecordInfo> = {
    consumption: {
        title: 'Consumption Records',
        description:
            'Consumption records are the raw electricity demand entries, usually measured in kWh for each month or period.',
        points: [
            'They represent the main historical demand signal used by the system.',
            'During preprocessing, these records are checked for missing values, sorted by date, and aligned with climate records.',
            'In the machine learning workflow, consumption values become the primary target pattern used to train and validate demand forecasts.',
        ],
    },
    climate: {
        title: 'Climate Records',
        description:
            'Climate records contain supporting environmental inputs such as temperature, solar irradiance, and peak demand conditions.',
        points: [
            'They help explain why electricity demand rises or falls across different months and seasons.',
            'During preprocessing, climate values are merged with matching consumption periods to create one complete analytical dataset.',
            'In machine learning, these fields work as features that improve forecast context and renewable energy readiness analysis.',
        ],
    },
    processed: {
        title: 'Processed Records',
        description:
            'Processed records are the cleaned, merged, and model-ready rows produced after preprocessing consumption and climate data.',
        points: [
            'They combine demand and climate inputs into a consistent monthly structure.',
            'They are the dataset previewed in the table and used by analytics, forecasting, and decision support modules.',
            'In the machine learning workflow, processed records reduce noise and give the model reliable feature columns for training and prediction.',
        ],
    },
};

export default function Preprocessing({
    processedRecords = [],
    counts,
}: {
    processedRecords: ProcessedRecord[];
    counts: Record<string, number>;
}) {
    const { flash } = usePage().props as any;

    const [search, setSearch] = useState('');
    const [yearFilter, setYearFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [infoModal, setInfoModal] = useState<RecordInfo | null>(null);

    const [itemsPerPage, setItemsPerPage] = useState(10);

    const filteredRecords = useMemo(() => {
        return processedRecords.filter((item) => {
            const period = `${item.year}-${String(item.month).padStart(2, '0')}`;

            const matchesSearch =
                period.includes(search.toLowerCase()) ||
                String(item.consumption_kwh).includes(search) ||
                String(item.temperature).includes(search) ||
                String(item.solar_irradiance).includes(search) ||
                String(item.peak_demand_kw).includes(search);

            const matchesYear =
                yearFilter === 'all' || String(item.year) === yearFilter;

            return matchesSearch && matchesYear;
        });
    }, [processedRecords, search, yearFilter]);

    const uniqueYears = Array.from(
        new Set(
            processedRecords.map((item) => String(item.year)).filter(Boolean),
        ),
    );

    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

    const paginatedRecords = filteredRecords.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Data Preprocessing
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Merge records, clean missing values, sort dates, and
                        generate ML features.
                    </p>
                </div>

                <Button
                    onClick={() => router.post('/admin/data-preprocessing/run')}
                >
                    Run Preprocessing
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

            <div className="grid gap-4 md:grid-cols-3">
                <StatCard
                    title="Consumption Records"
                    value={counts.consumption ?? 0}
                    helper="Raw electricity demand inputs"
                    icon={Activity}
                    onInfoClick={() => setInfoModal(recordInfo.consumption)}
                />

                <StatCard
                    title="Climate Records"
                    value={counts.climate ?? 0}
                    helper="Weather and solar feature inputs"
                    icon={CloudSun}
                    onInfoClick={() => setInfoModal(recordInfo.climate)}
                />

                <StatCard
                    title="Processed Records"
                    value={counts.processed ?? 0}
                    helper="Cleaned ML-ready records"
                    icon={Database}
                    onInfoClick={() => setInfoModal(recordInfo.processed)}
                />
            </div>

            <Card className="rounded-lg">
                <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <CardTitle>Processed Dataset Preview Table</CardTitle>

                        <div className="flex flex-col gap-2 md:flex-row">
                            <div className="relative">
                                <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />

                                <Input
                                    className="w-full pl-9 md:w-64"
                                    placeholder="Search period or values..."
                                    value={search}
                                    onChange={(event) => {
                                        setSearch(event.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                            <select
                                className="rounded-md border bg-background px-3 py-2 text-sm"
                                value={yearFilter}
                                onChange={(event) => {
                                    setYearFilter(event.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="all">All Years</option>

                                {uniqueYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
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
                                <th className="px-3 py-3 font-semibold">
                                    Period
                                </th>
                                <th className="px-3 py-3 font-semibold">kWh</th>
                                <th className="px-3 py-3 font-semibold">
                                    Temp
                                </th>
                                <th className="px-3 py-3 font-semibold">
                                    Solar
                                </th>
                                <th className="px-3 py-3 font-semibold">
                                    Peak kW
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedRecords.length > 0 ? (
                                paginatedRecords.map((item) => (
                                    <tr key={item.id} className="border-b">
                                        <td className="px-3 py-3">
                                            {item.year}-
                                            {String(item.month).padStart(
                                                2,
                                                '0',
                                            )}
                                        </td>
                                        <td className="px-3 py-3">
                                            {item.consumption_kwh}
                                        </td>
                                        <td className="px-3 py-3">
                                            {item.temperature}
                                        </td>
                                        <td className="px-3 py-3">
                                            {item.solar_irradiance}
                                        </td>
                                        <td className="px-3 py-3">
                                            {item.peak_demand_kw}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-3 py-8 text-center text-muted-foreground"
                                    >
                                        No processed records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {paginatedRecords.length} of{' '}
                            {filteredRecords.length} processed records
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
                                disabled={
                                    currentPage === totalPages ||
                                    totalPages === 0
                                }
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

                    <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                        {infoModal?.description}
                    </p>

                    <div className="space-y-3">
                        {infoModal?.points.map((point) => (
                            <div
                                key={point}
                                className="rounded-md border bg-muted/30 p-3 text-sm leading-relaxed"
                            >
                                {point}
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
