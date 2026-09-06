import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

export function LandingContainer({
    as: Element = 'div',
    children,
    className,
}: {
    as?: 'div' | 'section';
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <Element
            className={cn(
                'mx-auto w-full max-w-[1440px] px-landing-gutter',
                className,
            )}
        >
            {children}
        </Element>
    );
}

export function SectionHeading({
    align = 'left',
    description,
    eyebrow,
    title,
}: {
    align?: 'center' | 'left';
    description: string;
    eyebrow: string;
    title: string;
}) {
    return (
        <div
            className={cn(
                'max-w-3xl',
                align === 'center' && 'mx-auto text-center',
            )}
        >
            <p className="landing-eyebrow">{eyebrow}</p>
            <h2 className="mt-4 text-3xl leading-tight font-semibold tracking-[-0.035em] text-energy-navy-950 sm:text-4xl lg:text-[2.75rem]">
                {title}
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                {description}
            </p>
        </div>
    );
}

export function Reveal({
    children,
    className,
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;

        if (!element) {
            return;
        }

        if (
            window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
            !('IntersectionObserver' in window)
        ) {
            const frame = window.requestAnimationFrame(() => setVisible(true));

            return () => window.cancelAnimationFrame(frame);
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={cn('landing-reveal', className)}
            data-visible={visible}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

export function SourceBadge({ label }: { label: string }) {
    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs leading-5 font-semibold text-amber-900">
            <span
                className="size-1.5 shrink-0 rounded-full bg-amber-500"
                aria-hidden="true"
            />
            {label}
        </div>
    );
}

export function formatEnergy(value: number) {
    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0,
    }).format(value);
}

export function formatCompactEnergy(value: number) {
    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 1,
        notation: 'compact',
    }).format(value);
}
