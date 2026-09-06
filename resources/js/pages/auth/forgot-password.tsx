import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    const currentYear = new Date().getFullYear();
    return (
        <>
            <Head title="Forgot password" />

            <main className="min-h-screen bg-[#f5f6f8] text-slate-950">
                <div className="mx-auto grid min-h-screen max-w-[1280px] grid-cols-1 bg-white lg:grid-cols-[1.05fr_1fr]">
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
                                ACCOUNT RECOVERY
                            </p>

                            <h2 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-slate-950">
                                Recover access to your energy dashboard
                            </h2>

                            <p className="mt-7 max-w-lg text-lg leading-8 text-slate-600">
                                Enter your registered email and the system will
                                send a secure 6-digit reset code for your DSS Energy
                                account.
                            </p>
                        </div>

                        <div className="border-t border-slate-200 pt-7 text-sm text-slate-500">
                            © {currentYear} DSS Energy
                        </div>
                    </section>

                    <section className="flex min-h-screen items-center justify-center px-6 py-10">
                        <div className="w-full max-w-[430px] rounded-3xl border border-slate-200 bg-white px-9 py-10 shadow-sm">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                                    Forgot password
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    We will email a 6-digit reset code if the
                                    account exists in the system.
                                </p>
                            </div>

                            {status && (
                                <div className="mb-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                                    {status}
                                </div>
                            )}

                            <Form {...email.form()} className="flex flex-col gap-6">
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">
                                                Email address
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                autoComplete="email"
                                                autoFocus
                                                required
                                                placeholder="Enter your email"
                                                className="h-12 rounded-2xl border-slate-300 px-4 focus-visible:ring-emerald-500"
                                            />

                                            <InputError message={errors.email} />
                                        </div>

                                        <Button
                                            className="h-12 w-full rounded-2xl bg-emerald-500 font-semibold text-white hover:bg-emerald-600"
                                            disabled={processing}
                                            data-test="email-password-reset-link-button"
                                        >
                                            {processing && (
                                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                            )}
                                            Email reset code
                                        </Button>
                                    </>
                                )}
                            </Form>

                            <div className="mt-6 text-center text-sm text-slate-500">
                                Remember your password?{' '}
                                <TextLink
                                    href={login()}
                                    className="font-semibold text-emerald-600 hover:text-emerald-700"
                                >
                                    Log in
                                </TextLink>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Forgot password',
    description: 'Enter your email to receive a password reset link',
};
