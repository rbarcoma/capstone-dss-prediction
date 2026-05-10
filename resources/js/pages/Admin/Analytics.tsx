import { StatCard } from '@/components/dss/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { useState } from 'react';

function formatChartData(data: any[]) {
    return data.map((item) => ({
        label:
            item.label ??
            item.period ??
            item.month ??
            item.year ??
            `${item.year ?? ''}-${String(item.month ?? '').padStart(2, '0')}`,
        value:
            item.value ??
            item.consumption_kwh ??
            item.average_consumption ??
            item.total_consumption ??
            item.predicted_consumption_kwh ??
            0,
    }));
}

function AnalyticsChart({ data }: { data: any[] }) {
    const chartData = formatChartData(data);

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="label"
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                    />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                    />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#16a34a"
                        strokeWidth={3}
                        dot={{
                            r: 4,
                            strokeWidth: 2,
                        }}
                        activeDot={{
                            r: 6,
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default function Analytics({
    monthlyTrend = [],
    yearlyComparison = [],
    seasonalPattern = [],
    summary,
}: any) {
    const [infoModal, setInfoModal] = useState<{
        title: string;
        content: string;
    } | null>(null);

    const analyticsInfo = {
        averageConsumption: {
            title: 'Average Consumption',
            content:
                'Average Consumption represents the typical amount of electricity used within a specific period. It is calculated by adding all Consumption kWh values and dividing the total by the number of records. \n\nFormula: \naverage_consumption = consumption_kwh / number_of_records. \n\nThis helps identify the normal electricity usage trend over time.',
        },
        highestConsumption: {
            title: 'Highest Consumption',
            content:
                'Highest Consumption refers to the highest recorded electricity usage found in the dataset. It is obtained by identifying the maximum value in the consumption_kwh column. This metric helps determine the period with the greatest electricity demand.',
        },
        averagePeakDemand: {
            title: 'Average Peak Demand',
            content:
                'Average Peak Demand represents the average of the highest electricity demand values recorded in the dataset. It is calculated by adding all Peak Demand kW values and dividing the total by the number of records. \n\nFormula: \npeak_demand_kw = total_peak_demand_kw / number_of_records. \n\nThis helps measure the typical maximum power demand.',
        },
        averageSolarIrradiance: {
            title: 'Average Solar Irradiance',
            content:
                'Average Solar Irradiance represents the average amount of solar energy received in a specific location. It is calculated by adding all solar_irradiance values and dividing the total by the number of records. \n\nFormula: \nsolar_irradiance = total_solar_irradiance / number_of_records. \n\nThis helps assess the solar energy potential in the dataset.',
        },
    };

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-semibold">
                    Consumption Analytics
                </h1>
                <p className="text-sm text-muted-foreground">
                    Historical consumption, seasonal behavior, and peak demand insights.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <StatCard
                    title="Average Consumption"
                    value={`${summary?.average_consumption ?? 0} kWh`}
                    onInfoClick={() =>
                        setInfoModal(analyticsInfo.averageConsumption)
                    }
                />

                <StatCard
                    title="Highest Consumption"
                    value={`${summary?.highest_consumption ?? 0} kWh`}
                    helper={
                        summary?.highest_consumption_year &&
                        summary?.highest_consumption_month
                            ? `${summary.highest_consumption_year}-${String(
                                  summary.highest_consumption_month,
                              ).padStart(2, '0')}`
                            : ''
                    }
                    onInfoClick={() =>
                        setInfoModal(analyticsInfo.highestConsumption)
                    }
                />

                <StatCard
                    title="Average Peak Demand"
                    value={`${summary?.average_peak_demand ?? 0} kW`}
                    onInfoClick={() =>
                        setInfoModal(analyticsInfo.averagePeakDemand)
                    }
                />

                <StatCard
                    title="Avg Solar Irradiance"
                    value={summary?.average_solar_irradiance ?? 0}
                    onInfoClick={() =>
                        setInfoModal(analyticsInfo.averageSolarIrradiance)
                    }
                />
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
                <Card className="rounded-lg">
                    <CardHeader>
                        <CardTitle>Monthly Consumption Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AnalyticsChart data={monthlyTrend} />
                    </CardContent>
                </Card>

                <Card className="rounded-lg">
                    <CardHeader>
                        <CardTitle>Yearly Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AnalyticsChart data={yearlyComparison} />
                    </CardContent>
                </Card>

                <Card className="rounded-lg xl:col-span-2">
                    <CardHeader>
                        <CardTitle>Seasonal Pattern Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AnalyticsChart data={seasonalPattern} />
                    </CardContent>
                </Card>
            </div>

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
