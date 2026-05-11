import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Database,
    Settings2,
    BarChart3,
    Brain,
    Lightbulb,
    FileText,
    Users,
    BookOpen,
    FolderGit2,
    ClipboardList
} from 'lucide-react'
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
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
        },
        {
            title: 'Data Management',
            href: '/admin/data-management',
            icon: Database,
        },
        {
            title: 'Preprocessing',
            href: '/admin/data-preprocessing',
            icon: Settings2,
        },
        {
            title: 'Analytics',
            href: '/admin/analytics',
            icon: BarChart3,
        },
        {
            title: 'Forecasting',
            href: '/admin/forecasting',
            icon: Brain,
        },
        {
            title: 'Decision Support',
            href: '/admin/decision-support',
            icon: Lightbulb,
        },
        {
            title: 'Reports',
            href: '/admin/reports',
            icon: FileText,
        },
        {
            title: 'Audit Trail',
            href: '/admin/audit-trail',
            icon: ClipboardList,
        },
        {
            title: 'User Management',
            href: '/admin/users',
            icon: Users,
        },
];

const userNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/user/dashboard', icon: LayoutGrid },
    { title: 'Analytics', href: '/user/analytics', icon: BarChart3 },
    { title: 'Forecast Results', href: '/user/forecast-results', icon: Brain },
    { title: 'Decision Support', href: '/user/decision-support-results', icon: Lightbulb },
    { title: 'Reports', href: '/user/reports', icon: FileText },
];


const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const isAdmin = auth?.user?.role === 'admin';
    const mainNavItems = isAdmin ? adminNavItems : userNavItems;
    const homeHref = isAdmin ? '/admin/dashboard' : '/user/dashboard';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={homeHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
