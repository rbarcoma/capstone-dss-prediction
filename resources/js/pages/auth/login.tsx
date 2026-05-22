import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <>
            <Head title="Log in" />

            <main className="min-h-screen bg-[#f5f6f8] text-slate-950">
                <div className="mx-auto grid min-h-screen max-w-[1280px] grid-cols-1 bg-white lg:grid-cols-[1.05fr_1fr]">
                    {/* LEFT SIDE */}
                    <section className="relative hidden px-20 py-16 lg:flex lg:flex-col">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-sm font-bold text-white">
                                DE
                            </div>

                            <div>
                                <h1 className="text-lg font-bold text-slate-950">
                                    DSS Energy
                                </h1>
                                <p className="text-sm text-slate-500">
                                    Renewable Energy Decision Support
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-1 flex-col justify-center">
                            <p className="mb-5 text-sm font-semibold tracking-[0.35em] text-emerald-600">
                                WELCOME BACK
                            </p>

                            <h2 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-slate-950">
                                Sign in to continue to your dashboard
                            </h2>

                            <p className="mt-7 max-w-lg text-lg leading-8 text-slate-600">
                                Access your institutional energy analytics,
                                reports, and decision support tools in one clean
                                and organized platform.
                            </p>
                        </div>

                        <div className="border-t border-slate-200 pt-7 text-sm text-slate-500">
                            © 2026 DSS Energy
                        </div>
                    </section>

                    {/* RIGHT SIDE */}
                    <section className="flex min-h-screen items-center justify-center px-6 py-10">
                        <div className="w-full max-w-[430px] rounded-3xl border border-slate-200 bg-white px-9 py-10 shadow-sm">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                                    Log in
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    Enter your account credentials to access the
                                    system.
                                </p>
                            </div>

                            {status && (
                                <div className="mb-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                                    {status}
                                </div>
                            )}

                            <Form
                                {...store.form()}
                                resetOnSuccess={['password']}
                                className="flex flex-col gap-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-5">
                                            <div className="grid gap-2">
                                                <Label htmlFor="email">
                                                    Email address
                                                </Label>

                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="email"
                                                    placeholder="Enter your email"
                                                    className="h-12 rounded-2xl border-slate-300 px-4 focus-visible:ring-emerald-500"
                                                />

                                                <InputError
                                                    message={errors.email}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <div className="flex items-center">
                                                    <Label htmlFor="password">
                                                        Password
                                                    </Label>

                                                    {canResetPassword && (
                                                        <TextLink
                                                            href={request()}
                                                            className="ml-auto text-sm font-medium text-emerald-600 hover:text-emerald-700"
                                                            tabIndex={5}
                                                        >
                                                            Forgot password?
                                                        </TextLink>
                                                    )}
                                                </div>

                                                <PasswordInput
                                                    id="password"
                                                    name="password"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    placeholder="Enter your password"
                                                    className="h-12 rounded-2xl border-slate-300 px-4 focus-visible:ring-emerald-500"
                                                />

                                                <InputError
                                                    message={errors.password}
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                className="mt-1 h-12 w-full rounded-2xl bg-emerald-500 font-semibold text-white hover:bg-emerald-600"
                                                tabIndex={4}
                                                disabled={processing}
                                                data-test="login-button"
                                            >
                                                {processing && <Spinner />}
                                                Log in
                                            </Button>
                                        </div>

                                        {canRegister && (
                                            <div className="text-center text-sm text-slate-500">
                                                Don't have an account?{' '}
                                                <TextLink
                                                    href={register()}
                                                    tabIndex={5}
                                                    className="font-semibold text-emerald-600 hover:text-emerald-700"
                                                >
                                                    Sign up
                                                </TextLink>
                                            </div>
                                        )}
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
