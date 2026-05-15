import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';
import { Head, Link, usePage } from '@inertiajs/react';

const services = [
    {
        title: 'Consumption Analytics',
        description:
            'Monitor and analyze electricity consumption patterns for better planning and operational insight.',
    },
    {
        title: 'Machine Learning Forecasting',
        description:
            'Predict next-month electricity consumption using historical, climate, and demand data.',
    },
    {
        title: 'Decision Support',
        description:
            'Generate demand classification, renewable readiness, and structured recommendations.',
    },
    {
        title: 'Report Generation',
        description:
            'Create analytics, forecast, and decision support reports for authorized decision-makers.',
    },
];

const aboutCards = [
    {
        title: 'Reliable Analytics',
        description: 'Clear energy usage analysis for Quezon City planning.',
    },
    {
        title: 'Structured Insights',
        description: 'Data-backed recommendations for renewable transition.',
    },
    {
        title: 'Renewable Readiness',
        description: 'Assess opportunities for renewable energy adoption.',
    },
    {
        title: 'Long-Term Value',
        description: 'Support smarter and sustainable energy decisions.',
    },
];

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props as any;

    return (
        <>
            <Head title="Renewable Energy DSS" />

            <main className="min-h-screen bg-white text-slate-950">
                <header className="fixed inset-x-0 top-0 z-50 bg-slate-950/70 backdrop-blur-md">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <a href="#home" className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-sm font-bold text-white shadow-lg shadow-emerald-500/30">
                                DE
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white">
                                    DSS Energy
                                </h1>
                                <p className="text-xs font-semibold tracking-[0.25em] text-slate-300">
                                    SMART ENERGY PLATFORM
                                </p>
                            </div>
                        </a>

                        <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex">
                            <a href="#home" className="hover:text-white">
                                Home
                            </a>
                            <a href="#about" className="hover:text-white">
                                About
                            </a>
                            <a href="#services" className="hover:text-white">
                                Services
                            </a>
                            <a href="#contact" className="hover:text-white">
                                Contact
                            </a>

                            {auth.user ? (
                                <Button
                                    asChild
                                    className="rounded-full bg-emerald-500 px-7 text-white hover:bg-emerald-600"
                                >
                                    <Link href={dashboard()}>Dashboard</Link>
                                </Button>
                            ) : (
                                <Button
                                    asChild
                                    className="rounded-full bg-emerald-500 px-7 text-white hover:bg-emerald-600"
                                >
                                    <Link href={login()}>Log in</Link>
                                </Button>
                            )}
                        </nav>
                    </div>
                </header>

                <section
                    id="home"
                    className="relative flex min-h-screen items-center overflow-hidden bg-slate-950 pt-20 text-white"
                >
                    <img
                        src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1800&q=80"
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-emerald-950/40" />

                    <div className="relative mx-auto w-full max-w-7xl px-6 py-24">
                        <div className="max-w-4xl">
                            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-100">
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                Renewable Energy Analytics Platform
                            </div>

                            <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">
                                Decision Support System for{' '}
                                <span className="text-emerald-400">
                                    Renewable Energy
                                </span>{' '}
                                Transition in Quezon City
                            </h1>

                            <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-100">
                                A data-driven platform that analyzes average
                                electricity consumption, forecasts future demand,
                                and supports renewable energy transition through
                                machine learning and decision support insights.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/90">
                                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                                    Smarter energy decisions
                                </span>
                                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                                    Machine learning forecasting
                                </span>
                                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                                    Renewable planning
                                </span>
                            </div>

                            <div className="mt-9 flex flex-wrap gap-4">
                                <Button
                                    asChild
                                    className="h-14 rounded-full bg-emerald-500 px-9 font-semibold text-white hover:bg-emerald-600"
                                >
                                    <Link href={auth.user ? dashboard() : login()}>
                                        Get Started
                                    </Link>
                                </Button>

                                {canRegister && !auth.user && (
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="h-14 rounded-full border-white/30 bg-white/10 px-9 font-semibold text-white hover:bg-white/20 hover:text-white"
                                    >
                                        <Link href={register()}>
                                            Create Account
                                        </Link>
                                    </Button>
                                )}
                            </div>

                            <div className="mt-12 flex gap-12">
                                <div>
                                    <p className="text-3xl font-bold">24/7</p>
                                    <p className="text-sm text-slate-200">
                                        Data accessibility
                                    </p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">Smart</p>
                                    <p className="text-sm text-slate-200">
                                        Decision insights
                                    </p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">Eco</p>
                                    <p className="text-sm text-slate-200">
                                        Sustainability focus
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="about" className="bg-emerald-50/40 py-24">
                    <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1fr_0.95fr]">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.35em] text-emerald-600">
                                About Us
                            </p>
                            <h2 className="mt-5 max-w-2xl text-4xl font-bold leading-tight">
                                Supporting Quezon City in making smarter energy
                                decisions
                            </h2>
                            <p className="mt-8 text-lg leading-8 text-slate-600">
                                Our Decision Support System helps evaluate
                                electricity consumption patterns, identify
                                sustainability opportunities, and explore
                                renewable energy solutions through data-driven
                                insights.
                            </p>
                            <p className="mt-6 text-lg leading-8 text-slate-600">
                                The platform combines analytics, visualization,
                                machine learning forecasting, and structured
                                recommendations to support better planning and
                                long-term energy transition strategies.
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            {aboutCards.map((item) => (
                                <div
                                    key={item.title}
                                    className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
                                >
                                    <h3 className="text-xl font-bold">
                                        {item.title}
                                    </h3>
                                    <p className="mt-5 leading-7 text-slate-600">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="services" className="bg-slate-50 py-24">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="text-center">
                            <p className="text-sm font-bold uppercase tracking-[0.35em] text-emerald-600">
                                Services
                            </p>
                            <h2 className="mt-5 text-4xl font-bold">
                                What our platform provides
                            </h2>
                            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                                Explore the key capabilities that help analyze,
                                forecast, evaluate, and improve renewable energy
                                transition strategies.
                            </p>
                        </div>

                        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                            {services.map((service) => (
                                <div
                                    key={service.title}
                                    className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
                                >
                                    <h3 className="text-xl font-bold">
                                        {service.title}
                                    </h3>
                                    <p className="mt-5 leading-7 text-slate-600">
                                        {service.description}
                                    </p>
                                    <div className="mt-8 h-1 w-12 rounded-full bg-emerald-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section
                    id="contact"
                    className="bg-gradient-to-r from-white to-emerald-50 py-24"
                >
                    <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[0.95fr_1fr]">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.35em] text-emerald-600">
                                Contact
                            </p>
                            <h2 className="mt-5 text-4xl font-bold">
                                Get in touch with us
                            </h2>
                            <p className="mt-7 text-lg leading-8 text-slate-600">
                                Have questions about the platform, renewable
                                energy analytics, or Quezon City electricity
                                consumption forecasting? Reach out to us and
                                we’ll help you learn more about the system.
                            </p>

                            <div className="mt-10 space-y-5">
                                <div className="rounded-2xl border bg-white p-5">
                                    <p className="font-bold">Email</p>
                                    <p className="mt-1 text-slate-600">
                                        dssenergy@example.com
                                    </p>
                                </div>
                                <div className="rounded-2xl border bg-white p-5">
                                    <p className="font-bold">Phone</p>
                                    <p className="mt-1 text-slate-600">
                                        +63 912 345 6789
                                    </p>
                                </div>
                                <div className="rounded-2xl border bg-white p-5">
                                    <p className="font-bold">Address</p>
                                    <p className="mt-1 text-slate-600">
                                        Quezon City, Philippines
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form className="rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/70">
                            <div className="grid gap-5">
                                <div>
                                    <label className="text-sm font-medium">
                                        Full Name
                                    </label>
                                    <input
                                        className="mt-2 h-14 w-full rounded-2xl border px-4 outline-none focus:border-emerald-500"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">
                                        Email Address
                                    </label>
                                    <input
                                        className="mt-2 h-14 w-full rounded-2xl border px-4 outline-none focus:border-emerald-500"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">
                                        Message
                                    </label>
                                    <textarea
                                        className="mt-2 min-h-40 w-full rounded-2xl border px-4 py-4 outline-none focus:border-emerald-500"
                                        placeholder="Enter your message"
                                    />
                                </div>

                                <Button
                                    type="button"
                                    className="h-14 rounded-2xl bg-emerald-500 font-semibold text-white hover:bg-emerald-600"
                                >
                                    Send Message
                                </Button>
                            </div>
                        </form>
                    </div>
                </section>

                <footer className="bg-slate-950 px-6 py-10 text-center text-white">
                    <p>© 2026 DSS Energy. All rights reserved.</p>
                    <p className="mt-3 text-sm text-slate-400">
                        Transforming Energy Data into Sustainable Decisions
                    </p>
                </footer>
            </main>
        </>
    );
}
