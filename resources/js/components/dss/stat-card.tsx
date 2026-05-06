import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

export function StatCard({
    title,
    value,
    helper,
    icon: Icon,
}: {
    title: string;
    value: string | number;
    helper?: string;
    icon?: LucideIcon;
}) {
    return (
        <Card className="rounded-lg">
            <CardHeader className="flex-row items-center justify-between gap-3 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                {Icon && <Icon className="size-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-semibold">{value}</div>
                {helper && <p className="mt-1 text-xs text-muted-foreground">{helper}</p>}
            </CardContent>
        </Card>
    );
}
