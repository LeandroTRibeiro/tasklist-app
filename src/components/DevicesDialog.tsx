import { useEffect, useRef, useState, type FormEvent } from 'react';
import { isDeviceCode } from '../lib/device';
import { gsap, motion, useGSAP } from '../lib/gsap';

type Props = {
    open: boolean;
    deviceId: string;
    onClose: () => void;
    onSwitch: (code: string) => void;
};

// Shows this notebook's code and lets another device's code be adopted.
export function DevicesDialog({ open, deviceId, onClose, onSwitch }: Props) {
    const dialog = useRef<HTMLDialogElement>(null);
    const [code, setCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const element = dialog.current!;
        if (open && !element.open) {
            setCode('');
            setCopied(false);
            setError('');
            element.showModal();
        }
        if (!open && element.open) element.close();
    }, [open]);

    useGSAP(() => {
        if (open) gsap.from('.dialog-sheet', { y: 28, rotation: -2, autoAlpha: 0, duration: motion(0.4), ease: 'back.out(1.6)' });
    }, { dependencies: [open], scope: dialog });

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(deviceId);
            setCopied(true);
        } catch {
            setError('Não deu para copiar. Selecione o código e copie manualmente.');
        }
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        const value = code.trim().toLowerCase();
        if (!isDeviceCode(value)) {
            setError('Código inválido. Ele tem o formato xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.');
            return;
        }
        if (value === deviceId) {
            setError('Esse já é o código deste aparelho.');
            return;
        }
        onSwitch(value);
        onClose();
    };

    return (
        <dialog ref={dialog} className="dialog" onClose={onClose} onClick={e => e.target === dialog.current && onClose()} aria-labelledby="devices-title">
            <div className="dialog-sheet">
                <button type="button" className="close" onClick={onClose} aria-label="Fechar">×</button>
                <h2 id="devices-title">Suas tarefas em outro aparelho</h2>
                <p>Este é o código do seu caderno. No outro aparelho, abra o devtasks, toque no ícone de <b>aparelhos</b> e cole o código.</p>
                <div className="code">
                    <code>{deviceId}</code>
                    <button type="button" className="pill" onClick={copy}>{copied ? 'Copiado!' : 'Copiar'}</button>
                </div>
                <p className="hint">Guarde como uma senha: quem tem o código vê as suas tarefas.</p>

                <form className="code-form" onSubmit={submit}>
                    <label htmlFor="device-code">Tem o código de outro aparelho?</label>
                    <div>
                        <input id="device-code" value={code} onChange={e => { setCode(e.target.value); setError(''); }} placeholder="cole o código aqui" autoComplete="off" spellCheck={false} />
                        <button type="submit" className="pill">Usar</button>
                    </div>
                    <p className="hint">As tarefas deste aparelho vão junto para essa lista.</p>
                    {error && <p className="error" role="alert">{error}</p>}
                </form>
            </div>
        </dialog>
    );
}
