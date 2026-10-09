import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { gsap, motion, useGSAP } from '../lib/gsap';
import { LIMITS, type Task } from '../types';

// Hand-drawn box, tick and pen stroke (the same shapes as the app icon).
const BOX = 'M4.5 5.2c6-.8 13.2-.9 19.4-.3.6 6.2.7 12.4.2 18.6-6.3.6-12.8.6-19.2.1-.6-6.1-.8-12.3-.4-18.4z';
const TICK = 'M7.5 14.5c2 1.6 3.6 3.6 4.8 6 3-6.5 7-11.5 12.5-16';
const STRIKE = 'M2 8c30-4 60 3 95-1s70 4 101-2';

type Props = {
    task: Task;
    hidden: boolean;
    onToggle: (task: Task) => void;
    onDelete: (task: Task) => void;
    onSave: (task: Task, title: string, description: string) => void;
};

export function TaskItem({ task, hidden, onToggle, onDelete, onSave }: Props) {
    const root = useRef<HTMLLIElement>(null);
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);

    const { contextSafe } = useGSAP(() => {
        if (editing) gsap.from('.edit', { autoAlpha: 0, y: -6, duration: motion(0.25), ease: 'power2.out' });
    }, { dependencies: [editing], scope: root });

    // The tick and the pen stroke are drawn (or erased) while the list moves the task.
    const toggle = contextSafe(() => {
        const done = !task.done;
        const marks = root.current!.querySelectorAll('.tick, .strike path');
        gsap.fromTo(marks,
            { drawSVG: done ? 0 : '100%', opacity: 1 },
            { drawSVG: done ? '100%' : 0, duration: motion(done ? 0.4 : 0.25), stagger: motion(0.12), ease: 'power1.inOut', clearProps: 'all' });
        onToggle(task);
    });

    const remove = contextSafe(() => {
        gsap.to(root.current, { autoAlpha: 0, x: 40, duration: motion(0.28), ease: 'power2.in', onComplete: () => onDelete(task) });
    });

    const startEditing = () => {
        setTitle(task.title);
        setDescription(task.description);
        setEditing(true);
    };

    const save = (event: FormEvent) => {
        event.preventDefault();
        if (!title.trim()) return;
        onSave(task, title.trim(), description.trim());
        setEditing(false);
    };

    const cancelOnEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') setEditing(false);
    };

    return (
        <li ref={root} className={`task${task.done ? ' done' : ''}${hidden ? ' is-hidden' : ''}`} data-flip-id={task.id}>
            <button type="button" className="check" onClick={toggle} aria-pressed={task.done} aria-label={`${task.done ? 'Desmarcar' : 'Concluir'}: ${task.title}`}>
                <svg viewBox="0 0 28 28" aria-hidden="true"><path className="box" d={BOX} /><path className="tick" d={TICK} /></svg>
            </button>

            {editing ? (
                <form className="edit" onSubmit={save} onKeyDown={cancelOnEscape}>
                    <input value={title} onChange={e => setTitle(e.target.value)} maxLength={LIMITS.title} aria-label="Título da tarefa" autoFocus required />
                    <textarea value={description} onChange={e => setDescription(e.target.value)} maxLength={LIMITS.description} rows={2} placeholder="Detalhes (opcional)" aria-label="Detalhes da tarefa" />
                    <div className="edit-actions">
                        <button type="submit" className="pill">Salvar</button>
                        <button type="button" className="link" onClick={() => setEditing(false)}>Cancelar</button>
                    </div>
                </form>
            ) : (
                <div className="body">
                    <button type="button" className="title-wrap" onClick={startEditing} title="Editar tarefa">
                        <span className="title">{task.title}</span>
                        <svg className="strike" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true"><path d={STRIKE} /></svg>
                    </button>
                    {task.description && <p className="desc">{task.description}</p>}
                </div>
            )}

            {!editing && (
                <div className="actions">
                    <button type="button" className="icon" onClick={startEditing} aria-label={`Editar: ${task.title}`}>
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1-4.2L15.6 5.2a2 2 0 0 1 2.9 0l.3.3a2 2 0 0 1 0 2.9L8.2 19 4 20z" /><path d="M13.8 7l3.2 3.2" /></svg>
                    </button>
                    <button type="button" className="icon del" onClick={remove} aria-label={`Excluir: ${task.title}`}>×</button>
                </div>
            )}
        </li>
    );
}
