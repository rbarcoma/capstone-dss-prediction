import { StatCard } from '@/components/dss/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { ProcessedRecord } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

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
        new Set(processedRecords.map((item) => String(item.year)).filter(Boolean)),
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
                        Merge records, clean missing values, sort dates, and generate ML features.
                    </p>
                </div>

                <Button onClick={() => router.post('/admin/data-preprocessing/run')}>
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
                />

                <StatCard
                    title="Climate Records"
                    value={counts.climate ?? 0}
                />

                <StatCard
                    title="Processed Records"
                    value={counts.processed ?? 0}
                />
            </div>

            <Card className="rounded-lg">
                <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <CardTitle>Processed Dataset Preview Table</CardTitle>

                        <div className="flex flex-col gap-2 md:flex-row">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

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
                                <th className="px-3 py-3 font-semibold">Period</th>
                                <th className="px-3 py-3 font-semibold">kWh</th>
                                <th className="px-3 py-3 font-semibold">Temp</th>
                                <th className="px-3 py-3 font-semibold">Solar</th>
                                <th className="px-3 py-3 font-semibold">Peak kW</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedRecords.length > 0 ? (
                                paginatedRecords.map((item) => (
                                    <tr key={item.id} className="border-b">
                                        <td className="px-3 py-3">
                                            {item.year}-{String(item.month).padStart(2, '0')}
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
                                    currentPage === totalPages || totalPages === 0
                                }
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
