import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { home, login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    const currentYear = new Date().getFullYear();
    return (
        <>
            <Head title="Register" />

            <main className="min-h-screen bg-[#f5f6f8] text-slate-950">
                <div className="mx-auto grid min-h-screen max-w-[1280px] grid-cols-1 bg-white lg:grid-cols-[1.05fr_1fr]">
                    <section className="relative hidden px-20 py-16 lg:flex lg:flex-col">
                        <Link
                            href={home()}
                            aria-label="Go to the DSS Energy landing page"
                            className="flex w-fit items-center gap-3 rounded-xl transition-opacity outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-4"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-sm font-bold text-white">
                                DE
                            </div>

                            <div>
                                <h1 className="text-lg font-bold">
                                    DSS Energy
                                </h1>
                                <p className="text-sm text-slate-500">
                                    Renewable Energy Decision Support
                                </p>
                            </div>
                        </Link>

                        <div className="flex flex-1 flex-col justify-center">
                            <p className="mb-5 text-sm font-semibold tracking-[0.35em] text-emerald-600">
                                CREATE ACCOUNT
                            </p>

                            <h2 className="max-w-xl text-4xl font-bold leading-tight tracking-tight">
                                Start managing your energy data today
                            </h2>

                            <p className="mt-7 max-w-lg text-lg leading-8 text-slate-600">
                                Register your account to access the dashboard.
                                Additional analytics, forecast, DSS, and report
                                modules require admin permission approval.
                            </p>
                        </div>

                        <div className="border-t border-slate-200 pt-7 text-sm text-slate-500">
                            © {currentYear} DSS Energy.
                        </div>
                    </section>

                    <section className="flex min-h-screen items-center justify-center px-6 py-10">
                        <div className="w-full max-w-[430px] rounded-3xl border border-slate-200 bg-white px-9 py-10 shadow-sm">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold tracking-tight">
                                    Create account
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    Fill in your details to register. New accounts
                                    start with dashboard access only.
                                </p>
                            </div>

                            <Form
                                {...store.form()}
                                resetOnSuccess={[
                                    'password',
                                    'password_confirmation',
                                ]}
                                disableWhileProcessing
                                className="flex flex-col gap-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-5">
                                            <div className="grid gap-2">
                                                <Label htmlFor="name">
                                                    Full name
                                                </Label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="name"
                                                    name="name"
                                                    placeholder="Enter your full name"
                                                    className="h-12 rounded-2xl border-slate-300 px-4 focus-visible:ring-emerald-500"
                                                />
                                                <InputError
                                                    message={errors.name}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="email">
                                                    Email address
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="email"
                                                    name="email"
                                                    placeholder="Enter your email"
                                                    className="h-12 rounded-2xl border-slate-300 px-4 focus-visible:ring-emerald-500"
                                                />
                                                <InputError
                                                    message={errors.email}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="password">
                                                    Password
                                                </Label>
                                                <PasswordInput
                                                    id="password"
                                                    required
                                                    tabIndex={3}
                                                    autoComplete="new-password"
                                                    name="password"
                                                    placeholder="Create a password"
                                                    className="h-12 rounded-2xl border-slate-300 px-4 focus-visible:ring-emerald-500"
                                                />
                                                <InputError
                                                    message={errors.password}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="password_confirmation">
                                                    Confirm password
                                                </Label>
                                                <PasswordInput
                                                    id="password_confirmation"
                                                    required
                                                    tabIndex={4}
                                                    autoComplete="new-password"
                                                    name="password_confirmation"
                                                    placeholder="Confirm your password"
                                                    className="h-12 rounded-2xl border-slate-300 px-4 focus-visible:ring-emerald-500"
                                                />
                                                <InputError
                                                    message={
                                                        errors.password_confirmation
                                                    }
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                className="mt-1 h-12 w-full rounded-2xl bg-emerald-500 font-semibold text-white hover:bg-emerald-600"
                                                tabIndex={5}
                                                data-test="register-user-button"
                                            >
                                                {processing && <Spinner />}
                                                Create account
                                            </Button>
                                        </div>

                                        <div className="text-center text-sm text-slate-500">
                                            Already have an account?{' '}
                                            <TextLink
                                                href={login()}
                                                tabIndex={6}
                                                className="font-semibold text-emerald-600 hover:text-emerald-700"
                                            >
                                                Log in
                                            </TextLink>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}
