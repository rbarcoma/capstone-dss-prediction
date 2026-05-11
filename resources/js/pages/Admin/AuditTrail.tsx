import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

type AuditTrail = {
    id: number;
    user_name: string;
    module: string;
    action: string;
    description: string;
    ip_address?: string;
    status: string;
    created_at: string;
};

export default function AuditTrail({
    auditTrails = [],
}: {
    auditTrails: AuditTrail[];
}) {
    const [search, setSearch] = useState('');
    const [moduleFilter, setModuleFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const [itemsPerPage, setItemsPerPage] = useState(10);

    const filteredAuditTrails = useMemo(() => {
        return auditTrails.filter((item) => {
            const matchesSearch =
                item.user_name?.toLowerCase().includes(search.toLowerCase()) ||
                item.module?.toLowerCase().includes(search.toLowerCase()) ||
                item.action?.toLowerCase().includes(search.toLowerCase()) ||
                item.description?.toLowerCase().includes(search.toLowerCase()) ||
                item.status?.toLowerCase().includes(search.toLowerCase());

            const matchesModule =
                moduleFilter === 'all' || item.module === moduleFilter;

            return matchesSearch && matchesModule;
        });
    }, [auditTrails, search, moduleFilter]);

    const uniqueModules = Array.from(
        new Set(auditTrails.map((item) => item.module).filter(Boolean)),
    );

    const totalPages = Math.ceil(filteredAuditTrails.length / itemsPerPage);

    const paginatedAuditTrails = filteredAuditTrails.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-semibold">Audit Trail</h1>
                <p className="text-sm text-muted-foreground">
                    Track user actions, system activities, and important changes.
                </p>
            </div>

            <Card className="rounded-lg">
                <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <CardTitle>Audit Trail Table</CardTitle>

                        <div className="flex flex-col gap-2 md:flex-row">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                                <Input
                                    className="w-full pl-9 md:w-72"
                                    placeholder="Search audit logs..."
                                    value={search}
                                    onChange={(event) => {
                                        setSearch(event.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>

                            <select
                                className="rounded-md border bg-background px-3 py-2 text-sm"
                                value={moduleFilter}
                                onChange={(event) => {
                                    setModuleFilter(event.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="all">All Modules</option>

                                {uniqueModules.map((module) => (
                                    <option key={module} value={module}>
                                        {module}
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
                                <th className="px-3 py-2 font-semibold">User</th>
                                <th className="px-3 py-2 font-semibold">Module</th>
                                <th className="px-3 py-2 font-semibold">Action</th>
                                <th className="px-3 py-2 font-semibold">Description</th>
                                <th className="px-3 py-2 font-semibold">Status</th>
                                <th className="px-3 py-2 font-semibold">Date & Time</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedAuditTrails.length > 0 ? (
                                paginatedAuditTrails.map((item) => (
                                    <tr key={item.id} className="border-b">
                                        <td className="px-3 py-3">{item.user_name}</td>
                                        <td className="px-3 py-3">{item.module}</td>
                                        <td className="px-3 py-3">{item.action}</td>
                                        <td className="px-3 py-3">{item.description}</td>
                                        <td className="px-3 py-3 capitalize">
                                            {item.status}
                                        </td>
                                        <td className="px-3 py-3">
                                            {new Date(item.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-3 py-8 text-center text-muted-foreground"
                                    >
                                        No audit trail records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {paginatedAuditTrails.length} of{' '}
                            {filteredAuditTrails.length} audit records
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Previous
                            </button>

                            <span className="text-sm">
                                Page {currentPage} of {totalPages || 1}
                            </span>

                            <button
                                className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
                                disabled={currentPage === totalPages || totalPages === 0}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
