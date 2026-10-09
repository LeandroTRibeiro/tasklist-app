import type { SyncStatus } from '../types';

const LABELS: Record<SyncStatus, string> = {
    idle: 'Sincronizado',
    syncing: 'Sincronizando…',
    waking: 'Acordando o servidor…',
    offline: 'Offline · salvo no aparelho',
    error: 'Sem servidor · tentar de novo',
};

type Props = {
    status: SyncStatus;
    onSync: () => void;
    onDevices: () => void;
    theme: 'light' | 'dark';
    onTheme: () => void;
    onInstall: (() => void) | null;
};

export function Header({ status, onSync, onDevices, theme, onTheme, onInstall }: Props) {
    return (
        <header className="top" data-intro>
            <a className="brand" href="/">devtasks<small>o caderno de tarefas</small></a>
            <div className="top-actions">
                {onInstall && <button type="button" className="pill install" onClick={onInstall}>Instalar app</button>}
                <button type="button" className={`sync sync-${status}`} onClick={onSync} aria-live="polite" title="Sincronizar agora">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5" /></svg>
                    <span>{LABELS[status]}</span>
                </button>
                <button type="button" className="icon-btn" onClick={onDevices} aria-label="Usar em outro aparelho" title="Aparelhos">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="4" width="14" height="10" rx="2" /><rect x="15" y="9" width="7" height="12" rx="2" /><path d="M6 18h6" /></svg>
                </button>
                <button type="button" className="icon-btn" onClick={onTheme} aria-label={theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'}>
                    {theme === 'dark'
                        ? <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
                        : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>}
                </button>
            </div>
        </header>
    );
}
