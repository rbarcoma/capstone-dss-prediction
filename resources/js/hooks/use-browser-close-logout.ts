import { router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { login, logout } from '@/routes';

const BROWSER_AUTH_KEY = 'dss-energy.auth.browser-session';
const TAB_AUTH_KEY = 'dss-energy.auth.tab-session';

export function useBrowserCloseLogout() {
    const { auth } = usePage().props as any;
    const userId = auth?.user?.id;

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const clearMarkers = () => {
            localStorage.removeItem(BROWSER_AUTH_KEY);
            sessionStorage.removeItem(TAB_AUTH_KEY);
        };

        if (!userId) {
            clearMarkers();
            return;
        }

        const browserHadLoggedInUser =
            localStorage.getItem(BROWSER_AUTH_KEY) === 'active';
        const currentTabIsKnown =
            sessionStorage.getItem(TAB_AUTH_KEY) === 'active';

        if (browserHadLoggedInUser && !currentTabIsKnown) {
            clearMarkers();

            const csrfToken = document
                .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
                ?.getAttribute('content');

            fetch(logout.url(), {
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken ?? '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                method: 'POST',
            }).finally(() => {
                router.flushAll();
                window.location.replace(login.url());
            });

            return;
        }

        localStorage.setItem(BROWSER_AUTH_KEY, 'active');
        sessionStorage.setItem(TAB_AUTH_KEY, 'active');
    }, [userId]);
}
