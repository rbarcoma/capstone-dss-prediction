export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-11 items-center justify-center rounded-xl bg-emerald-500 text-sm font-bold text-white shadow-lg shadow-emerald-500/25">
                DE
            </div>
            <div className="ml-2 grid flex-1 text-left">
                <span className="truncate text-base font-bold leading-tight text-slate-950 dark:text-white">
                    DSS Energy
                </span>
                <span className="truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600 group-data-[collapsible=icon]:hidden">
                    Smart Energy
                </span>
            </div>
        </>
    );
}
