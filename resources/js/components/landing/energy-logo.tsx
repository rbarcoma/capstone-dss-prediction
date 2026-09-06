import { ChartNoAxesCombined } from 'lucide-react';

import { cn } from '@/lib/utils';

export function EnergyLogo({
    inverse = false,
    showDescriptor = true,
}: {
    inverse?: boolean;
    showDescriptor?: boolean;
}) {
    return (
        <span className="inline-flex min-w-0 items-center gap-3">
            <span
                className={cn(
                    'relative flex size-11 shrink-0 items-center justify-center rounded-[0.9rem] border shadow-sm',
                    inverse
                        ? 'border-white/15 bg-white/10 text-energy-green-300'
                        : 'border-energy-green-200 bg-energy-green-50 text-energy-green-700',
                )}
                aria-hidden="true"
            >
                <ChartNoAxesCombined className="size-5" strokeWidth={2.2} />
                <span className="absolute right-2 bottom-2 size-1.5 rounded-full bg-energy-green-500 ring-2 ring-white" />
            </span>
            <span className="min-w-0">
                <span
                    className={cn(
                        'block text-[1.05rem] leading-5 font-bold tracking-[-0.025em]',
                        inverse ? 'text-white' : 'text-energy-navy-950',
                    )}
                >
                    DSS Energy
                </span>
                {showDescriptor && (
                    <span
                        className={cn(
                            'mt-0.5 hidden text-[0.625rem] leading-4 font-bold tracking-[0.16em] uppercase sm:block',
                            inverse ? 'text-slate-400' : 'text-slate-500',
                        )}
                    >
                        Quezon City research platform
                    </span>
                )}
            </span>
        </span>
    );
}
