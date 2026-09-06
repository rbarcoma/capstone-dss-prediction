import { LandingContainer, SectionHeading } from './landing-shared';

export function EnergySnapshotSkeleton() {
    return (
        <section
            id="snapshot"
            className="bg-energy-mist py-landing-section"
            aria-busy="true"
            aria-label="Loading illustrative energy snapshot"
        >
            <LandingContainer>
                <SectionHeading
                    eyebrow="Energy snapshot"
                    title="A clearer view of demand, forecast, and readiness signals."
                    description="The analytics preview is loading. Chart summaries and fallback states remain available when live data is not connected."
                />
                <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-36 animate-pulse rounded-landing-card border border-slate-200 bg-white"
                        />
                    ))}
                </div>
                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-[25rem] animate-pulse rounded-landing-card border border-slate-200 bg-white"
                        />
                    ))}
                </div>
            </LandingContainer>
        </section>
    );
}
