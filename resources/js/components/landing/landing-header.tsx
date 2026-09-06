import { Link } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { dashboard, login, register } from '@/routes';

import { EnergyLogo } from './energy-logo';
import { LandingContainer } from './landing-shared';

const navigationItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'capabilities', label: 'Platform Capabilities' },
    { id: 'methodology', label: 'Methodology' },
    { id: 'contact', label: 'Contact' },
] as const;

type SectionId = (typeof navigationItems)[number]['id'];

function useActiveSection() {
    const [activeSection, setActiveSection] = useState<SectionId>('home');

    useEffect(() => {
        const sections = navigationItems.flatMap(({ id }) => {
            const section = document.getElementById(id);

            return section ? [section] : [];
        });

        if (!sections.length || !('IntersectionObserver' in window)) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            Math.abs(a.boundingClientRect.top) -
                            Math.abs(b.boundingClientRect.top),
                    )[0];

                if (visible) {
                    setActiveSection(visible.target.id as SectionId);
                }
            },
            {
                rootMargin: '-18% 0px -68% 0px',
                threshold: [0, 0.1, 0.5],
            },
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    return { activeSection, setActiveSection };
}

function NavigationLink({
    active,
    id,
    label,
    onNavigate,
}: {
    active: boolean;
    id: SectionId;
    label: string;
    onNavigate: (id: SectionId) => void;
}) {
    return (
        <a
            href={`#${id}`}
            aria-current={active ? 'location' : undefined}
            className="group relative flex min-h-11 items-center rounded-lg px-2.5 text-sm font-semibold text-slate-300 transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-energy-green-300 focus-visible:ring-offset-2 focus-visible:ring-offset-energy-navy-950"
            onClick={() => onNavigate(id)}
        >
            {label}
            <span
                className="absolute inset-x-2.5 bottom-0 h-0.5 origin-left scale-x-0 rounded-full bg-energy-green-300 transition-transform duration-200 group-hover:scale-x-100 data-[active=true]:scale-x-100"
                data-active={active}
                aria-hidden="true"
            />
        </a>
    );
}

export function LandingHeader({
    canRegister,
    isAuthenticated,
}: {
    canRegister: boolean;
    isAuthenticated: boolean;
}) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { activeSection, setActiveSection } = useActiveSection();
    const accountRoute = isAuthenticated ? dashboard() : login();

    const handleNavigate = (id: SectionId) => {
        setActiveSection(id);
        setMobileOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-energy-navy-950/95 text-white shadow-[0_10px_30px_-24px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <LandingContainer className="flex h-[4.75rem] items-center justify-between gap-6">
                <a
                    href="#home"
                    className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-energy-green-300 focus-visible:ring-offset-2 focus-visible:ring-offset-energy-navy-950"
                    aria-label="DSS Energy home"
                    onClick={() => handleNavigate('home')}
                >
                    <EnergyLogo inverse />
                </a>

                <nav
                    className="hidden items-center gap-1 xl:flex"
                    aria-label="Primary navigation"
                >
                    {navigationItems.map((item) => (
                        <NavigationLink
                            key={item.id}
                            {...item}
                            active={activeSection === item.id}
                            onNavigate={handleNavigate}
                        />
                    ))}
                </nav>

                <div className="hidden items-center gap-2 xl:flex">
                    {!isAuthenticated && canRegister && (
                        <Button
                            asChild
                            variant="ghost"
                            className="h-11 rounded-xl px-4 text-slate-300 hover:bg-white/10 hover:text-white focus-visible:ring-energy-green-300"
                        >
                            <Link href={register()}>Create account</Link>
                        </Button>
                    )}
                    <Button
                        asChild
                        className="h-11 rounded-xl bg-energy-green-700 px-5 text-white shadow-sm hover:bg-energy-green-800 focus-visible:ring-energy-green-300"
                    >
                        <Link href={accountRoute}>
                            {isAuthenticated ? 'Dashboard' : 'Log in'}
                        </Link>
                    </Button>
                </div>

                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetTrigger asChild>
                        <button
                            type="button"
                            className="inline-flex size-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white shadow-sm outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-energy-green-300 focus-visible:ring-offset-2 focus-visible:ring-offset-energy-navy-950 xl:hidden"
                            aria-label="Open navigation menu"
                        >
                            <Menu className="size-5" />
                        </button>
                    </SheetTrigger>
                    <SheetContent className="landing-mobile-sheet w-[min(88vw,23rem)] border-slate-200 bg-white p-0 text-energy-navy-950">
                        <SheetHeader className="border-b border-slate-200 p-6 pr-14 text-left">
                            <SheetTitle>
                                <EnergyLogo showDescriptor={false} />
                            </SheetTitle>
                            <SheetDescription className="pt-2 leading-6 text-slate-600">
                                Renewable-energy analytics, forecasting, and
                                decision support for the Quezon City study.
                            </SheetDescription>
                        </SheetHeader>

                        <nav
                            className="flex flex-col gap-1 p-4"
                            aria-label="Mobile navigation"
                        >
                            {navigationItems.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    aria-current={
                                        activeSection === item.id
                                            ? 'location'
                                            : undefined
                                    }
                                    className="flex min-h-12 items-center justify-between rounded-xl px-4 text-[0.95rem] font-semibold text-slate-700 transition-colors outline-none hover:bg-energy-green-50 hover:text-energy-green-800 focus-visible:ring-2 focus-visible:ring-energy-green-500"
                                    onClick={() => handleNavigate(item.id)}
                                >
                                    {item.label}
                                    {activeSection === item.id && (
                                        <span className="text-xs font-bold text-energy-green-700">
                                            Current
                                        </span>
                                    )}
                                </a>
                            ))}
                        </nav>

                        <div className="mt-auto space-y-3 border-t border-slate-200 p-5">
                            <Button
                                asChild
                                className="h-12 w-full rounded-xl bg-energy-navy-950 text-white hover:bg-energy-navy-800"
                            >
                                <Link
                                    href={accountRoute}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {isAuthenticated
                                        ? 'Open dashboard'
                                        : 'Log in to the platform'}
                                </Link>
                            </Button>
                            {!isAuthenticated && canRegister && (
                                <Button
                                    asChild
                                    variant="outline"
                                    className="h-12 w-full rounded-xl border-slate-300 bg-white text-energy-navy-950 hover:bg-slate-50"
                                >
                                    <Link
                                        href={register()}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Create an account
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            </LandingContainer>
        </header>
    );
}
