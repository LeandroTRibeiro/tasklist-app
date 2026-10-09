import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const THEME_COLORS: Record<Theme, string> = { light: '#fbfaf5', dark: '#1c2925' };

// Light notebook or dark chalkboard; index.html applies the saved choice before the first paint.
export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'));

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
        try {
            localStorage.setItem('devtasks:theme', theme);
        } catch {
            // Storage blocked: the theme just won't be remembered.
        }
    }, [theme]);

    return [theme, () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))] as const;
}
