import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import StatusBadge from '@/Components/Payments/StatusBadge';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

function StatCard({ label, value, tone = 'slate' }) {
    const tones = {
        slate: 'bg-slate-950 text-white',
        sky: 'bg-sky-100 text-sky-900',
        emerald: 'bg-emerald-100 text-emerald-900',
        rose: 'bg-rose-100 text-rose-900',
        amber: 'bg-amber-100 text-amber-900',
    };

    return (
        <div className={`rounded-3xl p-5 ${tones[tone]}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] opacity-80">
                {label}
            </p>
            <p className="mt-3 text-3xl font-black">{value}</p>
        </div>
    );
}

export default function Dashboard({ stats, transactions }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-700">
                        Admin area
                    </p>
                    <h2 className="mt-2 text-2xl font-black leading-tight text-slate-950">
                        Payment operations dashboard
                    </h2>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                            <StatCard
                                label="Total transactions"
                                value={stats.total_transactions}
                                tone="slate"
                            />
                            <StatCard
                                label="Successful"
                                value={stats.successful_transactions}
                                tone="emerald"
                            />
                            <StatCard
                                label="Failed"
                                value={stats.failed_transactions}
                                tone="rose"
                            />
                            <StatCard
                                label="Pending"
                                value={stats.pending_transactions}
                                tone="amber"
                            />
                            <StatCard
                                label="Volume"
                                value={currencyFormatter.format(stats.total_volume)}
                                tone="sky"
                            />
                        </div>

                        <div className="overflow-hidden rounded-[32px] bg-white shadow-sm">
                            <div className="border-b border-slate-100 px-6 py-5">
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Recent transactions
                                </h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-100">
                                    <thead className="bg-slate-50">
                                        <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                            <th className="px-6 py-4">Customer</th>
                                            <th className="px-6 py-4">Reference</th>
                                            <th className="px-6 py-4">Amount</th>
                                            <th className="px-6 py-4">Card</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Processed</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {transactions.map((transaction) => (
                                            <tr key={transaction.id} className="align-top">
                                                <td className="px-6 py-4">
                                                    <p className="font-semibold text-slate-900">
                                                        {transaction.customer_name}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        {transaction.customer_email}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    <p className="font-medium text-slate-900">
                                                        {transaction.payment_reference}
                                                    </p>
                                                    <p>{transaction.gateway_message}</p>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                                                    {currencyFormatter.format(transaction.amount)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {transaction.card_brand} ending {transaction.card_last_four}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <StatusBadge status={transaction.status} />
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {transaction.processed_at || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
