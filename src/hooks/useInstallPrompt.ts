import { useEffect, useState } from 'react';

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };

// Chrome, Edge and Android offer an install prompt; other browsers install from their own menu.
export function useInstallPrompt() {
    const [event, setEvent] = useState<InstallEvent | null>(null);

    useEffect(() => {
        const offer = (e: Event) => {
            e.preventDefault();
            setEvent(e as InstallEvent);
        };
        const installed = () => setEvent(null);
        window.addEventListener('beforeinstallprompt', offer);
        window.addEventListener('appinstalled', installed);
        return () => {
            window.removeEventListener('beforeinstallprompt', offer);
            window.removeEventListener('appinstalled', installed);
        };
    }, []);

    const install = async () => {
        if (!event) return;
        await event.prompt();
        await event.userChoice;
        setEvent(null);
    };

    return event ? install : null;
}
