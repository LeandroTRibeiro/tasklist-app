import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Composer } from './components/Composer';
import { DevicesDialog } from './components/DevicesDialog';
import { Header } from './components/Header';
import { TaskItem } from './components/TaskItem';
import { Toolbar } from './components/Toolbar';
import { useInstallPrompt } from './hooks/useInstallPrompt';
import { useTasks } from './hooks/useTasks';
import { useTheme } from './hooks/useTheme';
import { Flip, gsap, motion, useGSAP } from './lib/gsap';
import type { Filter, Task } from './types';

const normalize = (text: string) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

const today = () => {
    const text = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    return text.charAt(0).toUpperCase() + text.slice(1);
};

const greeting = () => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
};

export default function App() {
    const { tasks, status, notice, dismissNotice, deviceId, add, edit, switchCode, syncNow } = useTasks();
    const [theme, toggleTheme] = useTheme();
    const install = useInstallPrompt();
    const [filter, setFilter] = useState<Filter>('all');
    const [query, setQuery] = useState('');
    const [devicesOpen, setDevicesOpen] = useState(false);

    const sheet = useRef<HTMLDivElement>(null);
    const list = useRef<HTMLUListElement>(null);
    const bar = useRef<HTMLElement>(null);
    const layout = useRef<{ state: Flip.FlipState; height: number } | null>(null);
    const known = useRef<Set<string> | null>(null);

    // Pending tasks first, newest on top; finished ones sink to the bottom.
    const ordered = useMemo(() => [...tasks].sort((a, b) => Number(a.done) - Number(b.done) || b.createdAt - a.createdAt), [tasks]);
    const needle = normalize(query.trim());
    const matches = (task: Task) =>
        (filter === 'all' || (filter === 'done') === task.done) && (!needle || normalize(`${task.title} ${task.description}`).includes(needle));
    const shown = ordered.filter(matches).length;
    const pending = tasks.filter(t => !t.done).length;
    const finished = tasks.length - pending;

    const { contextSafe } = useGSAP(() => {
        // Opening: the page eases in and the boxes are drawn by hand.
        gsap.timeline({ defaults: { ease: 'power3.out' } })
            .from('[data-intro]', { y: 18, autoAlpha: 0, stagger: motion(0.08), duration: motion(0.6) })
            .from('.task', { y: 22, autoAlpha: 0, stagger: motion(0.05), duration: motion(0.5), clearProps: 'transform,opacity,visibility' }, '-=0.3')
            .from('.task .box', { drawSVG: 0, stagger: motion(0.07), duration: motion(0.5), ease: 'power1.inOut' }, 0.5);
    }, { scope: sheet });

    useGSAP(() => {
        if (bar.current) gsap.to(bar.current, { scaleX: tasks.length ? finished / tasks.length : 0, duration: motion(0.8), ease: 'power3.out' });
    }, { dependencies: [finished, tasks.length], scope: sheet });

    // Records where every task is right before a change, so Flip can animate to the new layout.
    const captureLayout = () => {
        if (list.current) layout.current = { state: Flip.getState(list.current.querySelectorAll('.task')), height: list.current.offsetHeight };
    };

    const playLayout = contextSafe(({ state, height }: { state: Flip.FlipState; height: number }) => {
        const element = list.current!;
        const target = element.offsetHeight; // measured before Flip lifts the tasks out of the flow
        // While the tasks move they are absolutely positioned, so the list holds its
        // height by easing from the old size to the new one instead of collapsing.
        gsap.fromTo(element, { height }, { height: target, duration: motion(0.6), ease: 'power2.inOut', overwrite: true, clearProps: 'height' });
        Flip.from(state, {
            targets: list.current!.querySelectorAll('.task'),
            duration: motion(0.6),
            ease: 'power2.inOut',
            absolute: true,
            zIndex: 5,
            onEnter: elements => gsap.fromTo(elements, { autoAlpha: 0, y: -14, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: motion(0.45), ease: 'back.out(1.6)' }),
            onLeave: elements => gsap.to(elements, { autoAlpha: 0, scale: 0.97, duration: motion(0.25) }),
        });
    });

    // Tasks that arrive from another device fade in.
    const playArrivals = contextSafe((elements: Element[]) => {
        gsap.from(elements, { autoAlpha: 0, y: -10, stagger: motion(0.05), duration: motion(0.45), ease: 'power2.out' });
    });

    useLayoutEffect(() => {
        const previous = known.current;
        known.current = new Set(tasks.map(t => t.id));
        const state = layout.current;
        layout.current = null;
        const element = list.current;
        if (!element) return;

        // The list always reserves the height of every task, whatever the filter or search,
        // so switching views or completing a task never changes the page's height.
        element.classList.add('measuring');
        const fullHeight = element.offsetHeight;
        element.classList.remove('measuring');
        element.style.minHeight = filter !== 'all' || needle ? `${fullHeight}px` : '';

        if (state) {
            playLayout(state);
        } else if (previous) {
            const arrivals = [...element.querySelectorAll<HTMLElement>('.task')].filter(el => !previous.has(el.dataset.flipId ?? ''));
            if (arrivals.length) playArrivals(arrivals);
        }
    }, [tasks, filter, query]);

    const handleAdd = (title: string) => {
        captureLayout();
        if (filter === 'done') setFilter('all');
        add(title);
    };
    const handleToggle = (task: Task) => {
        captureLayout();
        edit(task.id, { done: !task.done });
    };
    const handleDelete = (task: Task) => {
        captureLayout();
        edit(task.id, { deleted: true });
    };
    const handleSave = (task: Task, title: string, description: string) => {
        captureLayout();
        edit(task.id, { title, description });
    };
    const handleFilter = (value: Filter) => {
        captureLayout();
        setFilter(value);
    };
    const handleQuery = (value: string) => {
        captureLayout();
        setQuery(value);
    };

    return (
        <>
            <Header status={status} onSync={syncNow} onDevices={() => setDevicesOpen(true)} theme={theme} onTheme={toggleTheme} onInstall={install} />

            <main className="page">
                <div className="sheet" ref={sheet}>
                    <p className="date" data-intro>{greeting()} · {today()}</p>
                    <h1 data-intro>
                        {tasks.length === 0 && <>Um caderno <em>em branco</em>.</>}
                        {tasks.length > 0 && pending > 0 && <>Hoje tem <em>{pending} {pending === 1 ? 'tarefa' : 'tarefas'}</em> no caderno.</>}
                        {tasks.length > 0 && pending === 0 && <>Caderno em dia! <em>Tudo feito.</em></>}
                    </h1>
                    {tasks.length > 0 && (
                        <div className="progress" data-intro>
                            <span>{finished} de {tasks.length} {tasks.length === 1 ? 'feita' : 'feitas'}</span>
                            <span className="bar" aria-hidden="true"><i ref={bar} /></span>
                        </div>
                    )}

                    <Composer onAdd={handleAdd} />
                    <Toolbar filter={filter} onFilter={handleFilter} query={query} onQuery={handleQuery} />

                    <ul className="list" ref={list} aria-label="Tarefas">
                        {tasks.length > 0 && shown === 0 && (
                            <li className="empty">{needle ? `Nada com "${query.trim()}".` : filter === 'done' ? 'Nenhuma tarefa feita ainda.' : 'Nenhuma pendente. Caderno em dia!'}</li>
                        )}
                        {ordered.map(task => (
                            <TaskItem key={task.id} task={task} hidden={!matches(task)} onToggle={handleToggle} onDelete={handleDelete} onSave={handleSave} />
                        ))}
                    </ul>
                    {tasks.length === 0 && <p className="empty">Escreva sua primeira tarefa aí em cima ↑</p>}
                </div>

                <footer className="foot">
                    <p>Suas tarefas ficam salvas neste aparelho e funcionam sem internet. Para usar em outro aparelho, toque no ícone de aparelhos.</p>
                    <p>feito por <a href="https://github.com/LeandroTRibeiro" target="_blank" rel="noreferrer">Leandro Thiago Ribeiro</a></p>
                </footer>
            </main>

            {notice && (
                <div className="toast" role="status">
                    <span>{notice}</span>
                    <button type="button" onClick={dismissNotice} aria-label="Fechar aviso">×</button>
                </div>
            )}

            <DevicesDialog open={devicesOpen} deviceId={deviceId} onClose={() => setDevicesOpen(false)} onSwitch={switchCode} />
        </>
    );
}
