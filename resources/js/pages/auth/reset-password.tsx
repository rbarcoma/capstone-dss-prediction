import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { home, login } from '@/routes';

type Props = {
    email?: string;
    status?: string;
};

export default function ResetPassword({ email = '', status }: Props) {
    const currentYear = new Date().getFullYear();
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
        password_confirmation: '',
    });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/reset-password', {
            onSuccess: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Reset password" />

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
                                <h1 className="text-lg font-bold text-slate-950">
                                    DSS Energy
                                </h1>
                                <p className="text-sm text-slate-500">
                                    Renewable Energy Decision Support
                                </p>
                            </div>
                        </Link>

                        <div className="flex flex-1 flex-col justify-center">
                            <p className="mb-5 text-sm font-semibold tracking-[0.35em] text-emerald-600">
                                SECURE RESET
                            </p>

                            <h2 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-slate-950">
                                Create a new password
                            </h2>

                            <p className="mt-7 max-w-lg text-lg leading-8 text-slate-600">
                                Your reset code has been verified. Enter and
                                confirm your new account password.
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
                                    Reset password
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    Enter your new password to complete account recovery.
                                </p>
                            </div>

                            {status && (
                                <div className="mb-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="flex flex-col gap-6">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">
                                                Email address
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={email}
                                                readOnly
                                                aria-readonly="true"
                                                className="h-12 cursor-not-allowed rounded-2xl border-slate-300 bg-slate-50 px-4 text-slate-600"
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password">
                                                New password
                                            </Label>
                                            <PasswordInput
                                                id="password"
                                                value={data.password}
                                                onChange={(event) =>
                                                    setData('password', event.target.value)
                                                }
                                                autoComplete="new-password"
                                                required
                                                placeholder="Password"
                                                className="h-12 rounded-2xl border-slate-300 px-4 focus-visible:ring-emerald-500"
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password_confirmation">
                                                Confirm new password
                                            </Label>
                                            <PasswordInput
                                                id="password_confirmation"
                                                value={data.password_confirmation}
                                                onChange={(event) =>
                                                    setData(
                                                        'password_confirmation',
                                                        event.target.value,
                                                    )
                                                }
                                                autoComplete="new-password"
                                                required
                                                placeholder="Confirm password"
                                                className="h-12 rounded-2xl border-slate-300 px-4 focus-visible:ring-emerald-500"
                                            />
                                            <InputError
                                                message={errors.password_confirmation}
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="h-12 w-full rounded-2xl bg-emerald-500 font-semibold text-white hover:bg-emerald-600"
                                            disabled={processing}
                                            data-test="reset-password-button"
                                        >
                                            {processing && <Spinner />}
                                            Reset password
                                        </Button>
                            </form>

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

ResetPassword.layout = {
    title: 'Reset password',
    description: 'Enter the 6-digit code and your new password',
};
