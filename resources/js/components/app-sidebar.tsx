import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutGrid,
    Database,
    Settings2,
    BarChart3,
    Brain,
    Lightbulb,
    FileText,
    Users,
    FolderGit2,
    ClipboardList
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import type { NavItem } from '@/types';

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
        permission: 'admin.dashboard',
    },
    {
        title: 'Data Management',
        href: '/admin/data-management',
        icon: Database,
        permission: 'admin.data_management',
    },
    {
        title: 'Preprocessing',
        href: '/admin/data-preprocessing',
        icon: Settings2,
        permission: 'admin.preprocessing',
    },
    {
        title: 'Analytics',
        href: '/admin/analytics',
        icon: BarChart3,
        permission: 'admin.analytics',
    },
    {
        title: 'Forecasting',
        href: '/admin/forecasting',
        icon: Brain,
        permission: 'admin.forecasting',
    },
    {
        title: 'Decision Support',
        href: '/admin/decision-support',
        icon: Lightbulb,
        permission: 'admin.decision_support',
    },
    {
        title: 'Reports',
        href: '/admin/reports',
        icon: FileText,
        permission: 'admin.reports',
    },
    {
        title: 'Audit Trail',
        href: '/admin/audit-trail',
        icon: ClipboardList,
        permission: 'admin.audit_trail',
    },
        {
            title: 'User Management',
            href: '/admin/users',
            icon: Users,
            permission: 'admin.rbac',
        },
];

const userNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/user/dashboard', icon: LayoutGrid, permission: 'user.dashboard' },
    { title: 'Analytics', href: '/user/analytics', icon: BarChart3, permission: 'user.analytics' },
    { title: 'Forecast Results', href: '/user/forecast-results', icon: Brain, permission: 'user.forecast_results' },
    { title: 'Decision Support', href: '/user/decision-support-results', icon: Lightbulb, permission: 'user.decision_support' },
    { title: 'Reports', href: '/user/reports', icon: FileText, permission: 'user.reports' },
];


const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/rbarcoma/capstone-dss-prediction',
        icon: FolderGit2,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const [deniedItem, setDeniedItem] = useState<NavItem | null>(null);
    const isAdmin = auth?.user?.role === 'admin';
    const availableItems = isAdmin ? adminNavItems : userNavItems;
    const permissions = auth?.user?.permissions ?? availableItems
        .map((item) => item.permission)
        .filter(Boolean);
    const mainNavItems = availableItems.map((item) => ({
        ...item,
        hasAccess: !item.permission || permissions.includes(item.permission),
    }));
    const firstAccessibleItem = mainNavItems.find((item) => item.hasAccess);
    const homeHref = firstAccessibleItem?.href ?? (isAdmin ? '/admin/dashboard' : '/user/dashboard');

    return (
        <>
            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader className="px-4 pt-5">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                size="lg"
                                asChild
                                className="h-14 rounded-2xl px-2 hover:bg-emerald-50"
                            >
                                <Link href={homeHref} prefetch>
                                    <AppLogo />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent className="px-2 py-4">
                    <NavMain items={mainNavItems} onDenied={setDeniedItem} />
                </SidebarContent>

                <SidebarFooter className="gap-3 px-3 pb-4">
                    <NavFooter items={footerNavItems} className="mt-auto" />
                    <NavUser />
                </SidebarFooter>
            </Sidebar>

            <Dialog open={!!deniedItem} onOpenChange={() => setDeniedItem(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Access denied</DialogTitle>
                    </DialogHeader>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                        You do not have access or permission to use the{' '}
                        <span className="font-semibold text-foreground">
                            {deniedItem?.title}
                        </span>{' '}
                        module. Please contact an administrator if you need this
                        module enabled for your account.
                    </p>
                </DialogContent>
            </Dialog>
        </>
    );
}
