import { StatCard } from '@/components/dss/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { ForecastResult } from '@/types';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function ForecastResults({
    latestForecast,
    forecastHistory = [],
}: {
    latestForecast?: ForecastResult;
    forecastHistory: ForecastResult[];
}) {
    const [search, setSearch] = useState('');
    const [modelFilter, setModelFilter] = useState('all');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const latestForecastId = latestForecast?.id;

    const formatPredictionDate = (value?: string) => {
        if (!value) {
            return '-';
        }

        return new Intl.DateTimeFormat('en-PH', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(value));
    };

    const filteredForecasts = useMemo(() => {
        return forecastHistory.filter((item) => {
            const period = `${item.year}-${String(item.month).padStart(2, '0')}`;
            const model = item.model_type?.toLowerCase() ?? '';
            const predictedBy = item.user?.name?.toLowerCase() ?? 'admin';
            const predictedAt = formatPredictionDate(
                item.predicted_at ?? item.created_at,
            ).toLowerCase();

            const matchesSearch =
                period.includes(search.toLowerCase()) ||
                model.includes(search.toLowerCase()) ||
                predictedBy.includes(search.toLowerCase()) ||
                predictedAt.includes(search.toLowerCase()) ||
                String(item.predicted_consumption_kwh).includes(search);

            const matchesModel =
                modelFilter === 'all' || item.model_type === modelFilter;

            return matchesSearch && matchesModel;
        });
    }, [forecastHistory, search, modelFilter]);

    const uniqueModels = Array.from(
        new Set(forecastHistory.map((item) => item.model_type).filter(Boolean)),
    );

    const totalPages = Math.ceil(filteredForecasts.length / itemsPerPage);

    const paginatedForecasts = filteredForecasts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-semibold">Forecast Results</h1>
                <p className="text-sm text-muted-foreground">
                    Next-month consumption prediction and forecast history.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <StatCard
                    title="Predicted Consumption"
                    value={`${latestForecast?.predicted_consumption_kwh ?? 0} kWh`}
                />
                <StatCard
                    title="Possible Change"
                    value={`${latestForecast?.change_percent ?? 0}%`}
                />
                <StatCard
                    title="Model"
                    value={latestForecast?.model_type ?? 'No model'}
                />
            </div>

            <Card className="rounded-lg">
                <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <CardTitle>Forecast History Table</CardTitle>

                        <div className="flex flex-col gap-2 md:flex-row">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="w-full pl-9 md:w-64"
                                    placeholder="Search period or model..."
                                    value={search}
                                    onChange={(event) => {
                                        setSearch(event.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>

                            <select
                                className="rounded-md border bg-background px-3 py-2 text-sm"
                                value={modelFilter}
                                onChange={(event) => {
                                    setModelFilter(event.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="all">All Models</option>
                                {uniqueModels.map((model) => (
                                    <option key={model} value={model}>
                                        {model}
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
                            <tr className="border-b bg-muted/80 text-left">
                                <th className="px-3 py-2 font-semibold">Predicted At</th>
                                <th className="px-3 py-2 font-semibold">Predicted By</th>
                                <th className="px-3 py-2 font-semibold">Period</th>
                                <th className="px-3 py-2 font-semibold">Prediction</th>
                                <th className="px-3 py-2 font-semibold">Change</th>
                                <th className="px-3 py-2 font-semibold">Model</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedForecasts.length > 0 ? (
                                paginatedForecasts.map((item) => {
                                    const isLatest = item.id === latestForecastId;

                                    return (
                                        <tr
                                            key={item.id}
                                            className={`border-b ${isLatest ? 'bg-primary/5 font-bold' : ''}`}
                                        >
                                            <td className="px-3 py-2">
                                                {formatPredictionDate(item.predicted_at ?? item.created_at)}
                                            </td>
                                            <td className="px-3 py-2">
                                                {item.user?.name ?? 'Admin'}
                                            </td>
                                            <td className="px-3 py-2">
                                                {item.year}-{String(item.month).padStart(2, '0')}
                                            </td>
                                            <td className="px-3 py-2">
                                                {item.predicted_consumption_kwh} kWh
                                            </td>
                                            <td className="px-3 py-2">
                                                {item.change_percent ?? 0}%
                                            </td>
                                            <td className="px-3 py-2">
                                                {item.model_type}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-3 py-8 text-center text-muted-foreground"
                                    >
                                        No forecast records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {paginatedForecasts.length} of {filteredForecasts.length} forecasts
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
        </div>
    );
}
