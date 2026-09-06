import { Mail, MapPin, Phone } from 'lucide-react';

import { EnergyLogo } from './energy-logo';
import { LandingContainer } from './landing-shared';

const primaryLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#capabilities', label: 'Platform Capabilities' },
    { href: '#contact', label: 'Contact' },
];

const researchLinks = [
    { href: '#snapshot', label: 'Energy Snapshot' },
    { href: '#workflow', label: 'How the System Works' },
    { href: '#methodology', label: 'Methodology' },
    { href: '#transition', label: 'Transition Planning' },
];

const footerLinkClassName =
    'inline-flex min-h-11 items-center rounded-lg text-sm text-slate-300 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-energy-green-300 focus-visible:ring-offset-2 focus-visible:ring-offset-energy-navy-950';

export function LandingFooter() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-energy-navy-950 text-white">
            <LandingContainer className="py-12 lg:py-16">
                <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_0.8fr_1fr] lg:gap-12">
                    <div>
                        <a
                            href="#home"
                            className="inline-flex rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-energy-green-300 focus-visible:ring-offset-4 focus-visible:ring-offset-energy-navy-950"
                            aria-label="DSS Energy home"
                        >
                            <EnergyLogo inverse />
                        </a>
                        <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">
                            An academic forecasting and decision-support
                            platform for examining monthly
                            electricity-consumption signals and renewable-energy
                            transition questions in the Quezon City study
                            context.
                        </p>
                        <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.05] p-4 text-xs leading-5 text-slate-400">
                            Data-use notice: contact submissions are intended
                            only for responding to project inquiries. Do not
                            submit confidential records or credentials.
                        </div>
                    </div>

                    <nav aria-label="Footer platform navigation">
                        <h2 className="text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">
                            Platform
                        </h2>
                        <ul className="mt-4 space-y-0.5">
                            {primaryLinks.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className={footerLinkClassName}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <nav aria-label="Footer research navigation">
                        <h2 className="text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">
                            Research
                        </h2>
                        <ul className="mt-4 space-y-0.5">
                            {researchLinks.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className={footerLinkClassName}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div>
                        <h2 className="text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">
                            Project contact
                        </h2>
                        <address className="mt-5 space-y-4 text-sm text-slate-300 not-italic">
                            <a
                                href="mailto:dsspredictionqc@gmail.com"
                                className="flex min-h-11 items-center gap-3 rounded-lg outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-energy-green-300"
                            >
                                <Mail
                                    className="mt-0.5 size-4 shrink-0 text-energy-green-300"
                                    aria-hidden="true"
                                />
                                <span className="break-all">
                                    dsspredictionqc@gmail.com
                                </span>
                            </a>
                            <a
                                href="tel:+639123456789"
                                className="flex min-h-11 items-center gap-3 rounded-lg outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-energy-green-300"
                            >
                                <Phone
                                    className="mt-0.5 size-4 shrink-0 text-energy-green-300"
                                    aria-hidden="true"
                                />
                                +63 912 345 6789
                            </a>
                            <p className="flex items-start gap-3">
                                <MapPin
                                    className="mt-0.5 size-4 shrink-0 text-energy-green-300"
                                    aria-hidden="true"
                                />
                                Quezon City, Philippines
                            </p>
                        </address>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-4 text-xs leading-5 text-slate-400 lg:flex-row lg:items-start lg:justify-between">
                    <p>© {currentYear} DSS Energy.</p>
                    <p className="max-w-4xl lg:text-right">
                        Disclaimer: DSS Energy is an academic decision-support
                        platform. Forecasts, classifications, and
                        recommendations should be interpreted with relevant
                        domain expertise and do not represent official Quezon
                        City policy, endorsement, or guaranteed outcomes.
                    </p>
                </div>
            </LandingContainer>
        </footer>
    );
}
