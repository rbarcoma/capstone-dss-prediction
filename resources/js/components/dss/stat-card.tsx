import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { Info } from 'lucide-react';

export function StatCard({
    title,
    value,
    helper,
    icon: Icon,
    onInfoClick,
}: {
    title: string;
    value: string | number;
    helper?: string;
    icon?: LucideIcon;
    onInfoClick?: () => void;
}) {
    return (
        <Card className="rounded-lg">
            <CardHeader className="flex-row items-center justify-between gap-3 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>

                <div className="flex items-center gap-2">
                    {onInfoClick && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={onInfoClick}
                            className="size-7 rounded-full"
                        >
                            <Info className="size-4 text-muted-foreground" />
                        </Button>
                    )}

                    {Icon && <Icon className="size-4 text-muted-foreground" />}
                </div>
            </CardHeader>

            <CardContent>
                <div className="flex items-end justify-between gap-3">
                    <div className="text-2xl font-semibold">
                        {value}
                    </div>

                    {helper && (
                        <p className="pb-1 text-xs text-muted-foreground">
                            {helper}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
