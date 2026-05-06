type Point = {
    label?: string;
    value?: number | string;
    consumption_kwh?: number | string;
};

export function SimpleChart({ data, height = 180 }: { data: Point[]; height?: number }) {
    const values = data.map((item) => Number(item.value ?? item.consumption_kwh ?? 0));
    const max = Math.max(...values, 1);
    const width = Math.max(values.length * 42, 320);
    const points = values
        .map((value, index) => {
            const x = 20 + index * ((width - 40) / Math.max(values.length - 1, 1));
            const y = height - 20 - (value / max) * (height - 40);
            return `${x},${y}`;
        })
        .join(' ');

    return (
        <div className="overflow-x-auto">
            <svg viewBox={`0 0 ${width} ${height}`} className="h-48 min-w-full">
                <polyline fill="none" stroke="currentColor" strokeWidth="3" points={points} className="text-emerald-600" />
                {values.map((value, index) => {
                    const x = 20 + index * ((width - 40) / Math.max(values.length - 1, 1));
                    const y = height - 20 - (value / max) * (height - 40);
                    return <circle key={`${index}-${value}`} cx={x} cy={y} r="4" className="fill-emerald-600" />;
                })}
            </svg>
        </div>
    );
}
