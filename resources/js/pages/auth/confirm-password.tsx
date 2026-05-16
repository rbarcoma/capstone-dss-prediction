import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Confirm password" />

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
                                SECURE CHECK
                            </p>

                            <h2 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-slate-950">
                                Confirm your password to continue
                            </h2>

                            <p className="mt-7 max-w-lg text-lg leading-8 text-slate-600">
                                This extra step protects sensitive forecasting,
                                report, and decision support data while your
                                session is active.
                            </p>
                        </div>

                        <div className="border-t border-slate-200 pt-7 text-sm text-slate-500">
                            &copy; 2026 DSS Energy
                        </div>
                    </section>

                    <section className="flex min-h-screen items-center justify-center px-6 py-10">
                        <div className="w-full max-w-[430px] rounded-3xl border border-slate-200 bg-white px-9 py-10 shadow-sm">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                                    Confirm password
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    Re-enter your current password before
                                    continuing to this secure area.
                                </p>
                            </div>

                            <Form
                                {...store.form()}
                                resetOnSuccess={['password']}
                                className="flex flex-col gap-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="password">
                                                Password
                                            </Label>
                                            <PasswordInput
                                                id="password"
                                                name="password"
                                                placeholder="Enter your password"
                                                autoComplete="current-password"
                                                autoFocus
                                                required
                                                className="h-12 rounded-2xl border-slate-300 px-4 focus-visible:ring-emerald-500"
                                            />

                                            <InputError message={errors.password} />
                                        </div>

                                        <Button
                                            className="h-12 w-full rounded-2xl bg-emerald-500 font-semibold text-white hover:bg-emerald-600"
                                            disabled={processing}
                                            data-test="confirm-password-button"
                                        >
                                            {processing && <Spinner />}
                                            Confirm password
                                        </Button>
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

ConfirmPassword.layout = {
    title: 'Confirm your password',
    description:
        'This is a secure area of the application. Please confirm your password before continuing.',
};
