import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dashboard, login, register } from '@/routes';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    Brain,
    Database,
    FileText,
    Leaf,
    LineChart,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    SunMedium,
    Zap,
} from 'lucide-react';

const services = [
    {
        title: 'Consumption Analytics',
        description: 'Track monthly and yearly electricity patterns with summaries for planning and policy review.',
        icon: BarChart3,
    },
    {
        title: 'Machine Learning Forecasting',
        description: 'Predict next-month electricity consumption using processed historical, climate, and demand data.',
        icon: Brain,
    },
    {
        title: 'Decision Support',
        description: 'Classify demand, assess renewable readiness, and generate priority actions for transition planning.',
        icon: ShieldCheck,
    },
    {
        title: 'Report Generation',
        description: 'Prepare printable analytics, forecast, and DSS reports for authorized decision-makers.',
        icon: FileText,
    },
];

const metrics = [
    ['12+', 'ML input features'],
    ['3', 'Demand classes'],
    ['24/7', 'Web access'],
];

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Renewable Energy DSS">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            <main className="min-h-screen bg-[#f7faf8] text-slate-950">
                <header className="fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-slate-950/80 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
                        <a href="#home" className="flex items-center gap-3 text-white">
                            <span className="flex size-10 items-center justify-center rounded-md bg-emerald-500">
                                <Leaf className="size-5" />
                            </span>
                            <span className="text-sm font-semibold uppercase tracking-wide">QC Energy DSS</span>
                        </a>

                        <nav className="hidden items-center gap-7 text-sm text-slate-200 md:flex">
                            <a href="#home" className="hover:text-white">Home</a>
                            <a href="#about" className="hover:text-white">About Us</a>
                            <a href="#services" className="hover:text-white">Services</a>
                            <a href="#contact" className="hover:text-white">Contact Us</a>
                        </nav>

                        <div className="flex items-center gap-2">
                            {auth.user ? (
                                <Button asChild variant="secondary">
                                    <Link href={dashboard()}>Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild variant="ghost" className="hidden text-white hover:bg-white/10 hover:text-white sm:inline-flex">
                                        <Link href={login()}>Log in</Link>
                                    </Button>
                                    {canRegister && (
                                        <Button asChild className="bg-emerald-500 text-white hover:bg-emerald-600">
                                            <Link href={register()}>Get Started</Link>
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <section id="home" className="relative overflow-hidden bg-slate-950 pt-28 text-white">
                    <div className="absolute inset-0 opacity-30">
                        <img
                            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1800&q=80"
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="absolute inset-0 bg-slate-950/70" />

                    <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-24 lg:pt-24">
                        <div className="flex flex-col justify-center">
                            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-md border border-emerald-300/40 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-100">
                                <SunMedium className="size-4" />
                                Renewable energy transition intelligence
                            </div>
                            <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
                                A Decision Support System for Renewable Energy Transition in Quezon City
                            </h1>
                            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 md:text-lg">
                                Analyze electricity consumption, forecast next-month demand, assess readiness, and guide practical renewable energy decisions through data-driven recommendations.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Button asChild size="lg" className="bg-emerald-500 text-white hover:bg-emerald-600">
                                    <Link href={auth.user ? dashboard() : login()}>
                                        Open System <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                                    <a href="#services">View Services</a>
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-lg border border-white/15 bg-white/95 p-4 text-slate-950 shadow-2xl">
                            <div className="mb-4 flex items-center justify-between border-b pb-3">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Forecast Overview</p>
                                    <p className="text-xl font-semibold">Next-Month Energy Demand</p>
                                </div>
                                <Zap className="size-6 text-emerald-600" />
                            </div>
                            <div className="grid gap-3 sm:grid-cols-3">
                                {metrics.map(([value, label]) => (
                                    <div key={label} className="rounded-md border bg-slate-50 p-3">
                                        <p className="text-2xl font-bold text-emerald-700">{value}</p>
                                        <p className="text-xs text-slate-500">{label}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 h-44 rounded-md border bg-slate-50 p-4">
                                <div className="flex h-full items-end gap-3">
                                    {[48, 62, 54, 78, 72, 88, 82, 96].map((height, index) => (
                                        <div key={index} className="flex flex-1 flex-col justify-end">
                                            <div className="rounded-t bg-emerald-500" style={{ height: `${height}%` }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-4 grid gap-3 md:grid-cols-2">
                                <div className="rounded-md border p-3">
                                    <p className="text-xs text-slate-500">Demand Status</p>
                                    <p className="font-semibold">Moderate Demand</p>
                                </div>
                                <div className="rounded-md border p-3">
                                    <p className="text-xs text-slate-500">Readiness Level</p>
                                    <p className="font-semibold">High Readiness</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="about" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
                    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                        <div>
                            <p className="text-sm font-semibold uppercase text-emerald-700">About Us</p>
                            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Built for evidence-based energy planning.</h2>
                        </div>
                        <div className="space-y-5 text-slate-600">
                            <p>
                                QC Energy DSS helps decision-makers understand electricity consumption trends and translate forecasting results into actionable renewable energy transition plans.
                            </p>
                            <p>
                                The system combines data management, preprocessing, analytics, machine learning, and decision support in one web-based platform for authorized users.
                            </p>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="rounded-lg border bg-white p-4">
                                    <Database className="mb-3 size-5 text-emerald-600" />
                                    <p className="font-semibold text-slate-950">Data Quality</p>
                                </div>
                                <div className="rounded-lg border bg-white p-4">
                                    <LineChart className="mb-3 size-5 text-emerald-600" />
                                    <p className="font-semibold text-slate-950">Forecast Accuracy</p>
                                </div>
                                <div className="rounded-lg border bg-white p-4">
                                    <Leaf className="mb-3 size-5 text-emerald-600" />
                                    <p className="font-semibold text-slate-950">Energy Readiness</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="services" className="bg-white py-20">
                    <div className="mx-auto max-w-7xl px-5 lg:px-8">
                        <div className="max-w-2xl">
                            <p className="text-sm font-semibold uppercase text-emerald-700">Services</p>
                            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Core modules for renewable energy transition.</h2>
                        </div>
                        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                            {services.map((service) => (
                                <Card key={service.title} className="rounded-lg">
                                    <CardContent className="p-6">
                                        <service.icon className="mb-5 size-8 text-emerald-600" />
                                        <h3 className="text-lg font-semibold">{service.title}</h3>
                                        <p className="mt-3 text-sm leading-6 text-slate-600">{service.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="contact" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
                    <div className="grid gap-8 rounded-lg bg-slate-950 p-6 text-white md:p-10 lg:grid-cols-[0.9fr_1.1fr]">
                        <div>
                            <p className="text-sm font-semibold uppercase text-emerald-300">Contact Us</p>
                            <h2 className="mt-3 text-3xl font-bold">Coordinate energy planning with better data.</h2>
                            <div className="mt-8 space-y-4 text-sm text-slate-200">
                                <p className="flex items-center gap-3"><MapPin className="size-4 text-emerald-300" /> Quezon City, Philippines</p>
                                <p className="flex items-center gap-3"><Mail className="size-4 text-emerald-300" /> energy.dss@example.com</p>
                                <p className="flex items-center gap-3"><Phone className="size-4 text-emerald-300" /> +63 912 345 6789</p>
                            </div>
                        </div>
                        <form className="grid gap-4 rounded-lg bg-white p-5 text-slate-950">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <input className="rounded-md border px-3 py-3 text-sm" placeholder="Full name" />
                                <input className="rounded-md border px-3 py-3 text-sm" placeholder="Email address" />
                            </div>
                            <input className="rounded-md border px-3 py-3 text-sm" placeholder="Organization" />
                            <textarea className="min-h-32 rounded-md border px-3 py-3 text-sm" placeholder="Message" />
                            <Button type="button" className="bg-emerald-500 text-white hover:bg-emerald-600">Send Message</Button>
                        </form>
                    </div>
                </section>
            </main>
        </>
    );
}
