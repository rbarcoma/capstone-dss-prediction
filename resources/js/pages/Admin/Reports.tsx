import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Report } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { FileText, Printer, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function Reports({ reports = [] }: { reports: Report[] }) {
    const { flash } = usePage().props as any;

    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;

    const filteredReports = useMemo(() => {
        return reports.filter((report) => {
            const title = report.title?.toLowerCase() ?? '';
            const type = report.type?.toLowerCase() ?? '';

            const matchesSearch =
                title.includes(search.toLowerCase()) ||
                type.includes(search.toLowerCase());

            const matchesType =
                typeFilter === 'all' || report.type === typeFilter;

            return matchesSearch && matchesType;
        });
    }, [reports, search, typeFilter]);

    const uniqueTypes = Array.from(
        new Set(reports.map((report) => report.type).filter(Boolean)),
    );

    const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

    const paginatedReports = filteredReports.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Report Management</h1>
                    <p className="text-sm text-muted-foreground">
                        Generate, print, and download analytics, forecast, and DSS reports.
                    </p>
                </div>

                <Button onClick={() => router.post('/admin/reports')}>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                </Button>
            </div>

            {flash?.success && (
                <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                    {flash.success}
                </div>
            )}

            <Card className="rounded-lg">
                <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <CardTitle>Report History Table</CardTitle>

                        <div className="flex flex-col gap-2 md:flex-row">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                                <Input
                                    className="w-full pl-9 md:w-64"
                                    placeholder="Search reports..."
                                    value={search}
                                    onChange={(event) => {
                                        setSearch(event.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>

                            <select
                                className="rounded-md border bg-background px-3 py-2 text-sm"
                                value={typeFilter}
                                onChange={(event) => {
                                    setTypeFilter(event.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="all">All Types</option>

                                {uniqueTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/40 text-left">
                                <th className="px-3 py-3 font-semibold">Title</th>
                                <th className="px-3 py-3 font-semibold">Type</th>
                                <th className="px-3 py-3 font-semibold">Generated</th>
                                <th className="px-3 py-3 text-right font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedReports.length > 0 ? (
                                paginatedReports.map((report) => (
                                    <tr key={report.id} className="border-b">
                                        <td className="px-3 py-3">{report.title}</td>
                                        <td className="px-3 py-3">{report.type}</td>
                                        <td className="px-3 py-3">
                                            {new Date(report.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="flex justify-end">
                                                <Button
                                                    asChild
                                                    size="icon"
                                                    variant="outline"
                                                >
                                                    <Link
                                                        href={`/reports/${report.id}/download`}
                                                    >
                                                        <Printer className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-3 py-8 text-center text-muted-foreground"
                                    >
                                        No reports found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {paginatedReports.length} of{' '}
                            {filteredReports.length} reports
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
