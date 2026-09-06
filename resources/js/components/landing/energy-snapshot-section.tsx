import {
    Activity,
    BarChart3,
    CircleGauge,
    DatabaseZap,
    Leaf,
    LineChart as LineChartIcon,
    Sparkles,
    SunMedium,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { useReducedMotion } from '@/hooks/use-reduced-motion';

import type { LandingSnapshot } from './landing-data';
import {
    formatCompactEnergy,
    formatEnergy,
    LandingContainer,
    Reveal,
    SectionHeading,
    SourceBadge,
} from './landing-shared';

const chartColors = {
    grid: '#dce5e2',
    green: '#137a53',
    navy: '#12344f',
    slate: '#64748b',
};

function ChartEmptyState({ message }: { message: string }) {
    return (
        <div className="flex h-[18rem] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-8 text-center">
            <div>
                <DatabaseZap
                    className="mx-auto size-7 text-slate-400"
                    aria-hidden="true"
                />
                <p className="mt-3 text-sm font-bold text-energy-navy-950">
                    No chart data available
                </p>
                <p className="mt-1 max-w-sm text-sm leading-6 text-slate-600">
                    {message}
                </p>
            </div>
        </div>
    );
}

function ChartCard({
    children,
    description,
    icon: Icon,
    summary,
    title,
}: {
    children: React.ReactNode;
    description: string;
    icon: React.ComponentType<{
        className?: string;
        'aria-hidden'?: React.AriaAttributes['aria-hidden'];
    }>;
    summary: string;
    title: string;
}) {
    return (
        <article className="rounded-landing-card border border-slate-200 bg-white p-5 shadow-landing-card sm:p-6">
            <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-energy-green-50 text-energy-green-700">
                    <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                    <h3 className="text-lg font-bold tracking-[-0.025em] text-energy-navy-950">
                        {title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                        {description}
                    </p>
                </div>
            </div>
            <p className="sr-only">{summary}</p>
            <div className="mt-6">{children}</div>
        </article>
    );
}

function StatCard({
    detail,
    icon: Icon,
    label,
    value,
}: {
    detail: string;
    icon: React.ComponentType<{
        className?: string;
        'aria-hidden'?: React.AriaAttributes['aria-hidden'];
    }>;
    label: string;
    value: string;
}) {
    return (
        <article className="rounded-landing-card border border-slate-200 bg-white p-5 shadow-landing-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-energy-green-200 hover:shadow-landing-card-hover">
            <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-semibold text-slate-600">{label}</p>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-energy-green-50 text-energy-green-700">
                    <Icon className="size-4" aria-hidden="true" />
                </span>
            </div>
            <p className="mt-5 text-2xl font-bold tracking-[-0.04em] text-energy-navy-950">
                {value}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
        </article>
    );
}

function ReadinessIndicator({ snapshot }: { snapshot: LandingSnapshot }) {
    const readiness = snapshot.decisionSupport?.readinessLevel;
    const normalized = readiness?.toLowerCase() ?? '';
    const level = normalized.includes('high')
        ? 4
        : normalized.includes('develop') || normalized.includes('moderate')
          ? 3
          : normalized.includes('low') || normalized.includes('early')
            ? 1
            : readiness
              ? 2
              : 0;
    const inputs = [
        {
            label: 'Consumption forecast',
            available: Boolean(snapshot.forecast),
        },
        {
            label: 'Demand classification',
            available: Boolean(snapshot.decisionSupport?.demandStatus),
        },
        {
            label: 'Solar irradiance signal',
            available: Boolean(snapshot.decisionSupport?.solarSignal),
        },
        {
            label: 'Peak-demand history',
            available: snapshot.peakDemand.length > 0,
        },
    ];

    if (!readiness) {
        return (
            <ChartEmptyState message="Generate a forecast and decision-support result to display the renewable-readiness screening indicator." />
        );
    }

    return (
        <div className="min-h-[18rem]">
            <div className="rounded-2xl border border-energy-green-200 bg-energy-green-50/70 p-5">
                <p className="text-xs font-bold tracking-[0.12em] text-energy-green-800 uppercase">
                    Screening signal
                </p>
                <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                    <p className="text-2xl font-bold tracking-[-0.035em] text-energy-navy-950">
                        {readiness}
                    </p>
                    <p className="text-xs font-semibold text-slate-600">
                        Rule-based · not a certification
                    </p>
                </div>
                <div
                    className="mt-5 grid grid-cols-4 gap-2"
                    role="meter"
                    aria-label={`Renewable readiness: ${readiness}`}
                    aria-valuemin={0}
                    aria-valuemax={4}
                    aria-valuenow={level}
                >
                    {Array.from({ length: 4 }).map((_, index) => (
                        <span
                            key={index}
                            className={
                                index < level
                                    ? 'h-2.5 rounded-full bg-energy-green-600'
                                    : 'h-2.5 rounded-full border border-slate-300 bg-white'
                            }
                            aria-hidden="true"
                        />
                    ))}
                </div>
                <div className="mt-2 flex justify-between text-[0.625rem] font-bold tracking-wide text-slate-500 uppercase">
                    <span>Early signal</span>
                    <span>Stronger signal</span>
                </div>
            </div>

            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {inputs.map((input) => (
                    <li
                        key={input.label}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700"
                    >
                        <span
                            className={
                                input.available
                                    ? 'size-2 rounded-full bg-energy-green-600'
                                    : 'size-2 rounded-full border border-slate-400 bg-white'
                            }
                            aria-hidden="true"
                        />
                        {input.label}:{' '}
                        {input.available ? 'Available' : 'Missing'}
                    </li>
                ))}
            </ul>
            <p className="mt-4 text-xs leading-5 text-slate-500">
                Readiness is a transparent study-specific screening output. A
                technical and policy review is still required before action.
            </p>
        </div>
    );
}

export default function EnergySnapshotSection({
    snapshot,
}: {
    snapshot: LandingSnapshot;
}) {
    const reducedMotion = useReducedMotion();
    const trendStart = snapshot.trend[0];
    const trendEnd = snapshot.trend.at(-1);
    const comparisonEnd = snapshot.comparison.at(-1);
    const peakMaximum = snapshot.peakDemand.reduce(
        (current, point) => Math.max(current, point.peakDemandKw),
        0,
    );
    const forecastDisplay = snapshot.forecast
        ? `${formatEnergy(snapshot.forecast.predictedConsumptionKwh)} kWh`
        : 'Awaiting data';
    const statCards = [
        {
            label: 'Next-month estimate',
            value: forecastDisplay,
            detail: snapshot.forecast?.modelType ?? 'No model result connected',
            icon: Sparkles,
        },
        {
            label: 'Demand classification',
            value: snapshot.decisionSupport?.demandStatus ?? 'Awaiting data',
            detail: 'Transparent rule-based screening',
            icon: CircleGauge,
        },
        {
            label: 'Renewable readiness',
            value: snapshot.decisionSupport?.readinessLevel ?? 'Awaiting data',
            detail: 'Study-specific planning indicator',
            icon: Leaf,
        },
        {
            label: 'Solar potential signal',
            value: snapshot.decisionSupport?.solarSignal ?? 'Awaiting data',
            detail: 'Irradiance input, not a PV yield estimate',
            icon: SunMedium,
        },
    ];

    return (
        <section id="snapshot" className="bg-energy-mist py-landing-section">
            <LandingContainer>
                <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
                    <SectionHeading
                        eyebrow="Energy snapshot"
                        title="A clearer view of demand, forecast, and readiness signals."
                        description="The public preview demonstrates how the platform organizes electricity-consumption evidence. Connected backend data can replace this isolated sample through the documented page-prop contract."
                    />
                    <SourceBadge label={snapshot.sourceLabel} />
                </div>

                <Reveal className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {statCards.map((card) => (
                        <StatCard key={card.label} {...card} />
                    ))}
                </Reveal>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <Reveal>
                        <ChartCard
                            title="Electricity-consumption trend"
                            description="Monthly consumption pattern in kilowatt-hours (kWh)."
                            icon={LineChartIcon}
                            summary={
                                trendStart && trendEnd
                                    ? `Consumption moves from ${formatEnergy(trendStart.consumptionKwh)} kWh in ${trendStart.period} to ${formatEnergy(trendEnd.consumptionKwh)} kWh in ${trendEnd.period}.`
                                    : 'No monthly consumption trend is available.'
                            }
                        >
                            {snapshot.trend.length ? (
                                <div className="h-[18rem] w-full">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <AreaChart
                                            data={snapshot.trend}
                                            margin={{
                                                top: 8,
                                                right: 8,
                                                bottom: 4,
                                                left: 0,
                                            }}
                                            accessibilityLayer
                                        >
                                            <defs>
                                                <linearGradient
                                                    id="landingTrendFill"
                                                    x1="0"
                                                    x2="0"
                                                    y1="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor={
                                                            chartColors.green
                                                        }
                                                        stopOpacity={0.24}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor={
                                                            chartColors.green
                                                        }
                                                        stopOpacity={0.02}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid
                                                stroke={chartColors.grid}
                                                strokeDasharray="4 5"
                                                vertical={false}
                                            />
                                            <XAxis
                                                dataKey="period"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{
                                                    fill: chartColors.slate,
                                                    fontSize: 11,
                                                }}
                                                tickMargin={10}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{
                                                    fill: chartColors.slate,
                                                    fontSize: 11,
                                                }}
                                                tickFormatter={(value) =>
                                                    formatCompactEnergy(
                                                        Number(value),
                                                    )
                                                }
                                                width={42}
                                            />
                                            <Tooltip
                                                formatter={(value) => [
                                                    `${formatEnergy(Number(value))} kWh`,
                                                    'Consumption',
                                                ]}
                                                contentStyle={{
                                                    border: '1px solid #dce5e2',
                                                    borderRadius: 12,
                                                    boxShadow:
                                                        '0 12px 32px -18px rgba(7, 24, 39, 0.4)',
                                                    fontSize: 12,
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="consumptionKwh"
                                                name="Consumption (kWh)"
                                                stroke={chartColors.green}
                                                strokeWidth={3}
                                                fill="url(#landingTrendFill)"
                                                isAnimationActive={
                                                    !reducedMotion
                                                }
                                                animationDuration={650}
                                                activeDot={{ r: 5 }}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <ChartEmptyState message="Connect monthly consumption records to populate this trend." />
                            )}
                        </ChartCard>
                    </Reveal>

                    <Reveal delay={80}>
                        <ChartCard
                            title="Historical vs. forecast comparison"
                            description="Observed and model-estimated consumption, shown in kWh."
                            icon={BarChart3}
                            summary={
                                comparisonEnd?.predictedKwh !== null &&
                                comparisonEnd?.predictedKwh !== undefined
                                    ? `The final visible model estimate is ${formatEnergy(comparisonEnd.predictedKwh)} kWh for ${comparisonEnd.period}.`
                                    : 'No historical and forecast comparison is available.'
                            }
                        >
                            {snapshot.comparison.length ? (
                                <div className="h-[18rem] w-full">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <LineChart
                                            data={snapshot.comparison}
                                            margin={{
                                                top: 8,
                                                right: 10,
                                                bottom: 4,
                                                left: 0,
                                            }}
                                            accessibilityLayer
                                        >
                                            <CartesianGrid
                                                stroke={chartColors.grid}
                                                strokeDasharray="4 5"
                                                vertical={false}
                                            />
                                            <XAxis
                                                dataKey="period"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{
                                                    fill: chartColors.slate,
                                                    fontSize: 11,
                                                }}
                                                tickMargin={10}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{
                                                    fill: chartColors.slate,
                                                    fontSize: 11,
                                                }}
                                                tickFormatter={(value) =>
                                                    formatCompactEnergy(
                                                        Number(value),
                                                    )
                                                }
                                                width={42}
                                            />
                                            <Tooltip
                                                formatter={(value, name) => [
                                                    `${formatEnergy(Number(value))} kWh`,
                                                    name,
                                                ]}
                                                contentStyle={{
                                                    border: '1px solid #dce5e2',
                                                    borderRadius: 12,
                                                    boxShadow:
                                                        '0 12px 32px -18px rgba(7, 24, 39, 0.4)',
                                                    fontSize: 12,
                                                }}
                                            />
                                            <Legend
                                                wrapperStyle={{
                                                    fontSize: 12,
                                                    paddingTop: 12,
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="actualKwh"
                                                name="Historical (kWh)"
                                                stroke={chartColors.navy}
                                                strokeWidth={3}
                                                dot={{ r: 3 }}
                                                connectNulls={false}
                                                isAnimationActive={
                                                    !reducedMotion
                                                }
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="predictedKwh"
                                                name="Model estimate (kWh)"
                                                stroke={chartColors.green}
                                                strokeWidth={3}
                                                strokeDasharray="7 5"
                                                dot={{ r: 3 }}
                                                connectNulls
                                                isAnimationActive={
                                                    !reducedMotion
                                                }
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <ChartEmptyState message="Connect historical observations and stored model estimates to compare them here." />
                            )}
                        </ChartCard>
                    </Reveal>

                    <Reveal>
                        <ChartCard
                            title="Monthly peak demand"
                            description="Highest recorded demand by month, measured in kilowatts (kW)."
                            icon={Activity}
                            summary={
                                peakMaximum
                                    ? `The largest visible peak-demand value is ${formatEnergy(peakMaximum)} kW.`
                                    : 'No monthly peak-demand values are available.'
                            }
                        >
                            {snapshot.peakDemand.length ? (
                                <div className="h-[18rem] w-full">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={snapshot.peakDemand}
                                            margin={{
                                                top: 8,
                                                right: 8,
                                                bottom: 4,
                                                left: 0,
                                            }}
                                            accessibilityLayer
                                        >
                                            <CartesianGrid
                                                stroke={chartColors.grid}
                                                strokeDasharray="4 5"
                                                vertical={false}
                                            />
                                            <XAxis
                                                dataKey="period"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{
                                                    fill: chartColors.slate,
                                                    fontSize: 11,
                                                }}
                                                tickMargin={10}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{
                                                    fill: chartColors.slate,
                                                    fontSize: 11,
                                                }}
                                                tickFormatter={(value) =>
                                                    formatCompactEnergy(
                                                        Number(value),
                                                    )
                                                }
                                                width={42}
                                            />
                                            <Tooltip
                                                formatter={(value) => [
                                                    `${formatEnergy(Number(value))} kW`,
                                                    'Peak demand',
                                                ]}
                                                cursor={{
                                                    fill: 'rgba(19, 122, 83, 0.06)',
                                                }}
                                                contentStyle={{
                                                    border: '1px solid #dce5e2',
                                                    borderRadius: 12,
                                                    boxShadow:
                                                        '0 12px 32px -18px rgba(7, 24, 39, 0.4)',
                                                    fontSize: 12,
                                                }}
                                            />
                                            <Bar
                                                dataKey="peakDemandKw"
                                                name="Peak demand (kW)"
                                                fill={chartColors.navy}
                                                radius={[7, 7, 2, 2]}
                                                maxBarSize={42}
                                                isAnimationActive={
                                                    !reducedMotion
                                                }
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <ChartEmptyState message="Connect monthly peak-demand records to populate this visualization." />
                            )}
                        </ChartCard>
                    </Reveal>

                    <Reveal delay={80}>
                        <ChartCard
                            title="Renewable-readiness indicator"
                            description="A readable summary of the decision-support screening inputs."
                            icon={Leaf}
                            summary={
                                snapshot.decisionSupport?.readinessLevel
                                    ? `The current screening label is ${snapshot.decisionSupport.readinessLevel}.`
                                    : 'No renewable-readiness screening is available.'
                            }
                        >
                            <ReadinessIndicator snapshot={snapshot} />
                        </ChartCard>
                    </Reveal>
                </div>
            </LandingContainer>
        </section>
    );
}
