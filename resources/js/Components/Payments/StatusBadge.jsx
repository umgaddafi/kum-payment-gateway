export default function StatusBadge({ status }) {
    const tones = {
        successful: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
        failed: 'bg-rose-100 text-rose-700 ring-rose-200',
        pending: 'bg-amber-100 text-amber-700 ring-amber-200',
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ring-1 ${tones[status] || 'bg-slate-100 text-slate-700 ring-slate-200'}`}
        >
            {status}
        </span>
    );
}
