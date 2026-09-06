import {
    ArrowRight,
    ClipboardCheck,
    Leaf,
    SearchCheck,
    UsersRound,
} from 'lucide-react';

import { LandingContainer, Reveal, SectionHeading } from './landing-shared';

const transitionSteps = [
    {
        icon: SearchCheck,
        title: 'Interpret the signal',
        description:
            'Review the next-month estimate alongside the historical trend and the data limitations behind it.',
    },
    {
        icon: ClipboardCheck,
        title: 'Prioritize investigation',
        description:
            'Use the classifications and recommendations to identify questions that need deeper engineering or policy analysis.',
    },
    {
        icon: UsersRound,
        title: 'Apply domain judgment',
        description:
            'Bring energy, financial, environmental, planning, and community expertise into the final decision process.',
    },
];

export function TransitionSection() {
    return (
        <section id="transition" className="bg-white py-landing-section">
            <LandingContainer>
                <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center xl:gap-20">
                    <Reveal>
                        <figure className="relative">
                            <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-100 shadow-landing-card">
                                <img
                                    src="/images/landing/quezon-city-energy-transition.jpg"
                                    alt="Rooftop solar panels overlooking a dense tropical urban district as a small planning team reviews information together"
                                    width="1536"
                                    height="1024"
                                    loading="lazy"
                                    decoding="async"
                                    className="aspect-[4/3] h-full w-full object-cover"
                                />
                            </div>
                            <figcaption className="mt-3 text-xs leading-5 text-slate-500">
                                Purpose-built clean-energy illustration. No
                                government affiliation or endorsement is
                                implied.
                            </figcaption>
                            <div className="absolute right-4 bottom-12 left-4 rounded-2xl border border-white/60 bg-energy-navy-950/92 p-4 text-white shadow-xl backdrop-blur-md sm:right-auto sm:left-6 sm:max-w-sm sm:p-5">
                                <div className="flex items-start gap-3">
                                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-energy-green-400/15 text-energy-green-300">
                                        <Leaf
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <div>
                                        <p className="text-sm font-bold">
                                            Planning output, not infrastructure
                                            control
                                        </p>
                                        <p className="mt-1 text-xs leading-5 text-slate-300">
                                            The platform helps frame the next
                                            discussion; it does not operate the
                                            grid or energy assets.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </figure>
                    </Reveal>

                    <Reveal delay={80}>
                        <SectionHeading
                            eyebrow="Renewable-energy transition"
                            title="Move from model output to a more informed planning pathway."
                            description="A responsible transition process connects quantitative signals with deeper technical study, institutional context, and professional judgment. DSS Energy is designed to make that handoff clearer."
                        />

                        <ol className="mt-8 space-y-4">
                            {transitionSteps.map((step, index) => {
                                const Icon = step.icon;

                                return (
                                    <li
                                        key={step.title}
                                        className="group grid grid-cols-[auto_1fr] gap-4 rounded-2xl border border-slate-200 p-4 transition-colors hover:border-energy-green-200 hover:bg-energy-green-50/40"
                                    >
                                        <span className="flex size-11 items-center justify-center rounded-xl bg-energy-green-50 text-energy-green-700">
                                            <Icon
                                                className="size-5"
                                                aria-hidden="true"
                                            />
                                        </span>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-energy-green-700">
                                                    0{index + 1}
                                                </span>
                                                <h3 className="text-base font-bold text-energy-navy-950">
                                                    {step.title}
                                                </h3>
                                            </div>
                                            <p className="mt-1 text-sm leading-6 text-slate-600">
                                                {step.description}
                                            </p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>

                        <a
                            href="#contact"
                            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-energy-navy-950 px-5 text-sm font-bold text-white shadow-sm transition-colors outline-none hover:bg-energy-navy-800 focus-visible:ring-2 focus-visible:ring-energy-green-500 focus-visible:ring-offset-2"
                        >
                            Discuss the research platform
                            <ArrowRight className="size-4" aria-hidden="true" />
                        </a>
                    </Reveal>
                </div>
            </LandingContainer>
        </section>
    );
}
