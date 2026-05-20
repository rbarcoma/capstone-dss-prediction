import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({
    items = [],
    onDenied,
}: {
    items: NavItem[];
    onDenied?: (item: NavItem) => void;
}) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-0 py-0">
            <SidebarGroupLabel className="px-3 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-neutral-400">
                Platform
            </SidebarGroupLabel>
            <SidebarMenu className="mt-2 gap-1">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl(item.href)}
                            tooltip={{ children: item.title }}
                            className={`h-10 rounded-xl px-3 text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700 data-[active=true]:bg-emerald-500 data-[active=true]:font-semibold data-[active=true]:text-white data-[active=true]:shadow-sm data-[active=true]:shadow-emerald-500/25 dark:text-neutral-300 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-200 [&>svg]:text-current ${item.hasAccess === false ? 'opacity-60' : ''}`}
                        >
                            <Link
                                href={item.href}
                                prefetch={item.hasAccess !== false}
                                onClick={(event) => {
                                    if (item.hasAccess === false) {
                                        event.preventDefault();
                                        onDenied?.(item);
                                    }
                                }}
                            >
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
