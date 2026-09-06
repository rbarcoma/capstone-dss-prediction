import { useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    Clock3,
    LoaderCircle,
    Mail,
    MapPin,
    Phone,
    Send,
    ShieldCheck,
} from 'lucide-react';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import contact from '@/routes/contact';

import { LandingContainer, Reveal, SectionHeading } from './landing-shared';

type ContactFormData = {
    email: string;
    message: string;
    name: string;
    subject: string;
    website: string;
};

type FlashMessages = {
    error?: string;
    success?: string;
};

const contactDetails = [
    {
        icon: Mail,
        label: 'Project email',
        value: 'dsspredictionqc@gmail.com',
        href: 'mailto:dsspredictionqc@gmail.com',
    },
    {
        icon: Phone,
        label: 'Project mobile',
        value: '+63 951 441 6248',
        href: 'tel:+639514416248',
    },
    {
        icon: MapPin,
        label: 'Study location',
        value: 'Quezon City, Philippines',
    },
    {
        icon: Clock3,
        label: 'Typical response window',
        value: '2–3 working days',
    },
];

const fieldClassName =
    'mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-[0.95rem] text-energy-navy-950 shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 hover:border-slate-400 focus:border-energy-green-600 focus:ring-3 focus:ring-energy-green-500/15 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-500/10';

function FieldError({ error, id }: { error?: string; id: string }) {
    if (!error) {
        return null;
    }

    return (
        <p
            id={id}
            className="mt-2 flex items-start gap-1.5 text-sm leading-5 font-medium text-red-700"
        >
            <AlertCircle
                className="mt-0.5 size-3.5 shrink-0"
                aria-hidden="true"
            />
            {error}
        </p>
    );
}

export function ContactSection() {
    const formRef = useRef<HTMLFormElement>(null);
    const { flash } = usePage().props as {
        flash?: FlashMessages;
    };
    const { data, errors, post, processing, reset, setData } =
        useForm<ContactFormData>({
            email: '',
            message: '',
            name: '',
            subject: '',
            website: '',
        });

    const submitContact = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post(contact.send.url(), {
            preserveScroll: true,
            onError: () => {
                window.setTimeout(() => {
                    formRef.current
                        ?.querySelector<HTMLElement>('[aria-invalid="true"]')
                        ?.focus();
                }, 0);
            },
            onSuccess: (page) => {
                const responseFlash = page.props.flash as
                    | FlashMessages
                    | undefined;

                if (responseFlash?.success) {
                    reset();
                }
            },
        });
    };

    return (
        <section id="contact" className="bg-energy-mist py-landing-section">
            <LandingContainer>
                <div className="grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(32rem,1.18fr)] lg:gap-14 xl:gap-20">
                    <Reveal>
                        <SectionHeading
                            eyebrow="Contact the project team"
                            title="Start a focused conversation about the research and platform."
                            description="Appropriate inquiries include capstone evaluation, research methodology, system demonstrations, institutional use, and responsible data-integration planning."
                        />

                        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                            {contactDetails.map((item) => {
                                const Icon = item.icon;
                                const content = (
                                    <>
                                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-energy-green-50 text-energy-green-700">
                                            <Icon
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block text-xs font-semibold text-slate-500">
                                                {item.label}
                                            </span>
                                            <span className="mt-1 block text-sm leading-5 font-bold break-words text-energy-navy-950">
                                                {item.value}
                                            </span>
                                        </span>
                                    </>
                                );

                                return item.href ? (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        className="flex min-h-20 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors outline-none hover:border-energy-green-200 hover:bg-energy-green-50/30 focus-visible:ring-2 focus-visible:ring-energy-green-500 focus-visible:ring-offset-2"
                                    >
                                        {content}
                                    </a>
                                ) : (
                                    <div
                                        key={item.label}
                                        className="flex min-h-20 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                    >
                                        {content}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
                            <ShieldCheck
                                className="mt-0.5 size-4 shrink-0 text-energy-green-700"
                                aria-hidden="true"
                            />
                            <p>
                                Please do not send passwords, private
                                credentials, or sensitive energy records through
                                this public inquiry form.
                            </p>
                        </div>
                    </Reveal>

                    <Reveal delay={80}>
                        <form
                            ref={formRef}
                            className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-landing-card sm:p-7 lg:p-8"
                            aria-busy={processing}
                            onSubmit={submitContact}
                        >
                            <div className="flex items-start justify-between gap-5 border-b border-slate-200 pb-6">
                                <div>
                                    <p className="text-xs font-bold tracking-[0.14em] text-energy-green-700 uppercase">
                                        Send an inquiry
                                    </p>
                                    <h3 className="mt-2 text-xl font-bold tracking-[-0.025em] text-energy-navy-950">
                                        Tell us what you would like to review.
                                    </h3>
                                </div>
                                <span className="hidden size-11 shrink-0 items-center justify-center rounded-2xl bg-energy-navy-950 text-energy-green-300 sm:flex">
                                    <Send
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                </span>
                            </div>

                            <div
                                className="absolute top-auto -left-[10000px] h-px w-px overflow-hidden"
                                aria-hidden="true"
                            >
                                <label htmlFor="website">Website</label>
                                <input
                                    id="website"
                                    name="website"
                                    type="text"
                                    value={data.website}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    onChange={(event) =>
                                        setData('website', event.target.value)
                                    }
                                />
                            </div>

                            {flash?.success && (
                                <div
                                    className="mt-6 flex items-start gap-3 rounded-xl border border-energy-green-200 bg-energy-green-50 p-4 text-sm leading-6 font-medium text-energy-green-900"
                                    role="status"
                                    tabIndex={-1}
                                >
                                    <CheckCircle2
                                        className="mt-0.5 size-4 shrink-0"
                                        aria-hidden="true"
                                    />
                                    {flash.success}
                                </div>
                            )}
                            {flash?.error && (
                                <div
                                    className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 font-medium text-red-800"
                                    role="alert"
                                    tabIndex={-1}
                                >
                                    <AlertCircle
                                        className="mt-0.5 size-4 shrink-0"
                                        aria-hidden="true"
                                    />
                                    {flash.error}
                                </div>
                            )}

                            <fieldset
                                disabled={processing}
                                className="mt-6 grid gap-5"
                            >
                                <legend className="sr-only">
                                    Contact information and inquiry details
                                </legend>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="contact-name"
                                            className="text-sm font-bold text-energy-navy-950"
                                        >
                                            Full Name{' '}
                                            <span
                                                className="text-red-600"
                                                aria-hidden="true"
                                            >
                                                *
                                            </span>
                                        </label>
                                        <input
                                            id="contact-name"
                                            name="name"
                                            type="text"
                                            value={data.name}
                                            required
                                            minLength={2}
                                            maxLength={255}
                                            autoComplete="name"
                                            placeholder="Juan Dela Cruz"
                                            className={fieldClassName}
                                            aria-invalid={Boolean(errors.name)}
                                            aria-describedby={
                                                errors.name
                                                    ? 'contact-name-error'
                                                    : undefined
                                            }
                                            onChange={(event) =>
                                                setData(
                                                    'name',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                        <FieldError
                                            id="contact-name-error"
                                            error={errors.name}
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="contact-email"
                                            className="text-sm font-bold text-energy-navy-950"
                                        >
                                            Email Address{' '}
                                            <span
                                                className="text-red-600"
                                                aria-hidden="true"
                                            >
                                                *
                                            </span>
                                        </label>
                                        <input
                                            id="contact-email"
                                            name="email"
                                            type="email"
                                            value={data.email}
                                            required
                                            maxLength={255}
                                            autoComplete="email"
                                            inputMode="email"
                                            placeholder="name@institution.edu.ph"
                                            className={fieldClassName}
                                            aria-invalid={Boolean(errors.email)}
                                            aria-describedby={
                                                errors.email
                                                    ? 'contact-email-error'
                                                    : undefined
                                            }
                                            onChange={(event) =>
                                                setData(
                                                    'email',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                        <FieldError
                                            id="contact-email-error"
                                            error={errors.email}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="contact-subject"
                                        className="text-sm font-bold text-energy-navy-950"
                                    >
                                        Subject{' '}
                                        <span
                                            className="text-red-600"
                                            aria-hidden="true"
                                        >
                                            *
                                        </span>
                                    </label>
                                    <input
                                        id="contact-subject"
                                        name="subject"
                                        type="text"
                                        value={data.subject}
                                        required
                                        minLength={3}
                                        maxLength={150}
                                        autoComplete="off"
                                        placeholder="e.g., Capstone methodology review"
                                        className={fieldClassName}
                                        aria-invalid={Boolean(errors.subject)}
                                        aria-describedby={
                                            errors.subject
                                                ? 'contact-subject-hint contact-subject-error'
                                                : 'contact-subject-hint'
                                        }
                                        onChange={(event) =>
                                            setData(
                                                'subject',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <div className="mt-2 flex items-start justify-between gap-4 text-xs text-slate-500">
                                        <p id="contact-subject-hint">
                                            Use a short, specific inquiry title.
                                        </p>
                                        <span aria-hidden="true">
                                            {data.subject.length}/150
                                        </span>
                                    </div>
                                    <FieldError
                                        id="contact-subject-error"
                                        error={errors.subject}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="contact-message"
                                        className="text-sm font-bold text-energy-navy-950"
                                    >
                                        Message{' '}
                                        <span
                                            className="text-red-600"
                                            aria-hidden="true"
                                        >
                                            *
                                        </span>
                                    </label>
                                    <textarea
                                        id="contact-message"
                                        name="message"
                                        value={data.message}
                                        required
                                        minLength={10}
                                        maxLength={5000}
                                        rows={6}
                                        autoComplete="off"
                                        placeholder="Describe your question, review request, or intended institutional use."
                                        className={`${fieldClassName} min-h-40 resize-y`}
                                        aria-invalid={Boolean(errors.message)}
                                        aria-describedby={
                                            errors.message
                                                ? 'contact-message-hint contact-message-error'
                                                : 'contact-message-hint'
                                        }
                                        onChange={(event) =>
                                            setData(
                                                'message',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    <div className="mt-2 flex items-start justify-between gap-4 text-xs text-slate-500">
                                        <p id="contact-message-hint">
                                            Include enough context for the team
                                            to route your inquiry.
                                        </p>
                                        <span aria-hidden="true">
                                            {data.message.length.toLocaleString()}
                                            /5,000
                                        </span>
                                    </div>
                                    <FieldError
                                        id="contact-message-error"
                                        error={errors.message}
                                    />
                                </div>

                                <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-xs leading-5 text-slate-500">
                                        <span className="text-red-600">*</span>{' '}
                                        Required fields
                                    </p>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="h-12 rounded-xl bg-energy-navy-950 px-6 text-sm font-bold text-white hover:bg-energy-navy-800 focus-visible:ring-energy-green-500"
                                    >
                                        {processing ? (
                                            <>
                                                <LoaderCircle
                                                    className="size-4 animate-spin motion-reduce:animate-none"
                                                    aria-hidden="true"
                                                />
                                                Sending inquiry…
                                            </>
                                        ) : (
                                            <>
                                                Send inquiry
                                                <Send
                                                    className="size-4"
                                                    aria-hidden="true"
                                                />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </fieldset>
                        </form>
                    </Reveal>
                </div>
            </LandingContainer>
        </section>
    );
}
