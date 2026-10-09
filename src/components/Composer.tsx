import { useState, type FormEvent } from 'react';
import { LIMITS } from '../types';

export function Composer({ onAdd }: { onAdd: (title: string) => void }) {
    const [title, setTitle] = useState('');

    const submit = (event: FormEvent) => {
        event.preventDefault();
        if (!title.trim()) return;
        onAdd(title);
        setTitle('');
    };

    return (
        <form className="composer" onSubmit={submit} data-intro>
            <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Escreva uma nova tarefa…"
                aria-label="Nova tarefa"
                maxLength={LIMITS.title}
                autoComplete="off"
                enterKeyHint="done"
            />
            <button type="submit" disabled={!title.trim()}>＋<span> Anotar</span></button>
        </form>
    );
}
