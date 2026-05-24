import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';

type Props = {
    email?: string;
    status?: string;
};

export default function VerifyResetCode({ email = '', status }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/reset-password/code');
    };

    return (
        <>
            <Head title="Verify reset code" />

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
                                CODE VERIFICATION
                            </p>

                            <h2 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-slate-950">
                                Enter the code sent to your email
                            </h2>

                            <p className="mt-7 max-w-lg text-lg leading-8 text-slate-600">
                                Verify the 6-digit code first. After successful
                                verification, you can create a new password.
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
                                    Verify code
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    Enter the 6-digit reset code from your email.
                                </p>
                            </div>

                            {status && (
                                <div className="mb-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>
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
                                    <Label htmlFor="code">6-digit reset code</Label>
                                    <Input
                                        id="code"
                                        value={data.code}
                                        onChange={(event) =>
                                            setData(
                                                'code',
                                                event.target.value
                                                    .replace(/\D/g, '')
                                                    .slice(0, 6),
                                            )
                                        }
                                        inputMode="numeric"
                                        maxLength={6}
                                        placeholder="000000"
                                        required
                                        className="h-12 rounded-2xl border-slate-300 px-4 text-center text-lg font-semibold tracking-[0.5em] focus-visible:ring-emerald-500"
                                    />
                                    <InputError message={errors.code} />
                                </div>

                                <Button
                                    type="submit"
                                    className="h-12 w-full rounded-2xl bg-emerald-500 font-semibold text-white hover:bg-emerald-600"
                                    disabled={processing}
                                >
                                    {processing && <Spinner />}
                                    Verify code
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

VerifyResetCode.layout = {
    title: 'Verify reset code',
    description: 'Enter the 6-digit code sent to your email',
};
