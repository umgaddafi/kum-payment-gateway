import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import StatusBadge from '@/Components/Payments/StatusBadge';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

const currencyFormatters = {
    USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
    NGN: new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }),
    EUR: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }),
};

const formatCurrency = (amount, currency) =>
    (currencyFormatters[currency] || currencyFormatters.USD).format(amount);

export default function Home({
    auth,
    canLogin,
    canRegister,
    transactions,
    simulationRules,
}) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        customer_name: '',
        customer_email: '',
        amount: '120',
        currency: 'USD',
        card_holder_name: '',
        card_number: '4242 4242 4242 4242',
        expiry_month: '12',
        expiry_year: '28',
        cvv: '123',
    });

    const submit = (event) => {
        event.preventDefault();

        post(route('payments.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('card_holder_name', 'cvv');
                setData('card_number', '4242 4242 4242 4242');
            },
        });
    };

    return (
        <>
            <Head title="Payment Gateway Simulation" />

            <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eff6ff_0%,_#f8fafc_45%,_#e2e8f0_100%)] text-slate-900">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <header className="flex flex-col gap-4 rounded-[32px] border border-white/70 bg-white/80 px-6 py-5 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-700">
                                Kum Payment Gateway
                            </p>
                            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                                React + Laravel payment simulation
                            </h1>
                        </div>

                        <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600">
                            {auth.user ? (
                                <>
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-full border border-slate-200 px-4 py-2 transition hover:border-sky-300 hover:text-sky-700"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="rounded-full bg-slate-950 px-4 py-2 text-white"
                                    >
                                        Log out
                                    </Link>
                                </>
                            ) : (
                                <>
                                    {canLogin && (
                                        <Link
                                            href={route('login')}
                                            className="rounded-full border border-slate-200 px-4 py-2 transition hover:border-sky-300 hover:text-sky-700"
                                        >
                                            Admin login
                                        </Link>
                                    )}
                                    {canRegister && (
                                        <Link
                                            href={route('register')}
                                            className="rounded-full bg-slate-950 px-4 py-2 text-white"
                                        >
                                            Create admin user
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </header>

                    <main className="mt-8 grid gap-8 lg:grid-cols-[1.25fr_0.9fr]">
                        <section className="rounded-[32px] bg-slate-950 p-6 text-white shadow-[0_25px_90px_rgba(15,23,42,0.24)] sm:p-8">
                            <div className="max-w-2xl">
                                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
                                    Checkout simulator
                                </p>
                                <h2 className="mt-3 text-4xl font-black tracking-tight">
                                    Test a payment flow that feels production-ready.
                                </h2>
                                <p className="mt-4 text-base leading-7 text-slate-300">
                                    This demo stores transactions in MySQL through Laravel and renders the interface with React via Inertia.
                                </p>
                            </div>

                            {flash.paymentResult && (
                                <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-5">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <StatusBadge status={flash.paymentResult.status} />
                                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200">
                                            Ref: {flash.paymentResult.reference}
                                        </p>
                                    </div>
                                    <p className="mt-3 text-lg font-semibold">
                                        {flash.paymentResult.message}
                                    </p>
                                    {flash.paymentResult.failure_reason && (
                                        <p className="mt-2 text-sm text-rose-200">
                                            {flash.paymentResult.failure_reason}
                                        </p>
                                    )}
                                </div>
                            )}

                            <form onSubmit={submit} className="mt-8 space-y-5">
                                <div className="grid gap-5 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Customer name
                                        </label>
                                        <TextInput
                                            value={data.customer_name}
                                            onChange={(e) => setData('customer_name', e.target.value)}
                                            className="w-full rounded-2xl border-white/10 bg-white/5 text-white"
                                        />
                                        <InputError message={errors.customer_name} className="mt-2" />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Customer email
                                        </label>
                                        <TextInput
                                            type="email"
                                            value={data.customer_email}
                                            onChange={(e) => setData('customer_email', e.target.value)}
                                            className="w-full rounded-2xl border-white/10 bg-white/5 text-white"
                                        />
                                        <InputError message={errors.customer_email} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Amount
                                        </label>
                                        <TextInput
                                            type="number"
                                            step="0.01"
                                            min="1"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            className="w-full rounded-2xl border-white/10 bg-white/5 text-white"
                                        />
                                        <InputError message={errors.amount} className="mt-2" />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">
                                            Currency
                                        </label>
                                        <select
                                            value={data.currency}
                                            onChange={(e) => setData('currency', e.target.value)}
                                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none focus:ring-sky-400"
                                        >
                                            <option value="USD" className="text-slate-900">USD</option>
                                            <option value="NGN" className="text-slate-900">NGN</option>
                                            <option value="EUR" className="text-slate-900">EUR</option>
                                        </select>
                                        <InputError message={errors.currency} className="mt-2" />
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                                    <h3 className="text-lg font-semibold">Card details</h3>
                                    <div className="mt-4 grid gap-5 md:grid-cols-2">
                                        <div className="md:col-span-2">
                                            <label className="mb-2 block text-sm font-medium text-slate-200">
                                                Card holder name
                                            </label>
                                            <TextInput
                                                value={data.card_holder_name}
                                                onChange={(e) => setData('card_holder_name', e.target.value)}
                                                className="w-full rounded-2xl border-white/10 bg-white/5 text-white"
                                            />
                                            <InputError message={errors.card_holder_name} className="mt-2" />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="mb-2 block text-sm font-medium text-slate-200">
                                                Card number
                                            </label>
                                            <TextInput
                                                value={data.card_number}
                                                onChange={(e) => setData('card_number', e.target.value)}
                                                className="w-full rounded-2xl border-white/10 bg-white/5 text-white"
                                            />
                                            <InputError message={errors.card_number} className="mt-2" />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-200">
                                                Expiry month
                                            </label>
                                            <TextInput
                                                value={data.expiry_month}
                                                onChange={(e) => setData('expiry_month', e.target.value)}
                                                className="w-full rounded-2xl border-white/10 bg-white/5 text-white"
                                            />
                                            <InputError message={errors.expiry_month} className="mt-2" />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-200">
                                                Expiry year
                                            </label>
                                            <TextInput
                                                value={data.expiry_year}
                                                onChange={(e) => setData('expiry_year', e.target.value)}
                                                className="w-full rounded-2xl border-white/10 bg-white/5 text-white"
                                            />
                                            <InputError message={errors.expiry_year} className="mt-2" />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-200">
                                                CVV
                                            </label>
                                            <TextInput
                                                value={data.cvv}
                                                onChange={(e) => setData('cvv', e.target.value)}
                                                className="w-full rounded-2xl border-white/10 bg-white/5 text-white"
                                            />
                                            <InputError message={errors.cvv} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                <PrimaryButton
                                    className="rounded-full bg-sky-400 px-6 py-3 text-slate-950 hover:bg-sky-300 focus:bg-sky-300 active:bg-sky-500"
                                    disabled={processing}
                                >
                                    {processing ? 'Processing...' : 'Simulate payment'}
                                </PrimaryButton>
                            </form>
                        </section>

                        <aside className="space-y-6">
                            <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_15px_60px_rgba(15,23,42,0.08)]">
                                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-700">
                                    Simulation rules
                                </p>
                                <div className="mt-4 space-y-3">
                                    {simulationRules.map((rule) => (
                                        <div
                                            key={`${rule.card}-${rule.result}`}
                                            className="rounded-2xl bg-slate-50 p-4"
                                        >
                                            <p className="text-sm font-semibold text-slate-900">{rule.card}</p>
                                            <p className="mt-1 text-sm text-slate-600">{rule.result}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_15px_60px_rgba(15,23,42,0.08)]">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-700">
                                            Recent transactions
                                        </p>
                                        <h3 className="mt-2 text-2xl font-black text-slate-950">
                                            Live mock activity
                                        </h3>
                                    </div>
                                    {auth.user && (
                                        <Link
                                            href={route('dashboard')}
                                            className="text-sm font-semibold text-sky-700"
                                        >
                                            Open dashboard
                                        </Link>
                                    )}
                                </div>

                                <div className="mt-5 space-y-4">
                                    {transactions.length === 0 ? (
                                        <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                                            No transactions yet. Submit the form to create the first one.
                                        </p>
                                    ) : (
                                        transactions.map((transaction) => (
                                            <div
                                                key={transaction.id}
                                                className="rounded-3xl border border-slate-100 p-4"
                                            >
                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                    <div>
                                                        <p className="font-semibold text-slate-900">
                                                            {transaction.customer_name}
                                                        </p>
                                                        <p className="text-sm text-slate-500">
                                                            {transaction.card_brand} ending {transaction.card_last_four}
                                                        </p>
                                                    </div>
                                                    <StatusBadge status={transaction.status} />
                                                </div>
                                                <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                                                    <p className="font-semibold text-slate-900">
                                                        {formatCurrency(transaction.amount, transaction.currency)}
                                                    </p>
                                                    <p className="text-slate-500">
                                                        {transaction.payment_reference}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        </aside>
                    </main>
                </div>
            </div>
        </>
    );
}
