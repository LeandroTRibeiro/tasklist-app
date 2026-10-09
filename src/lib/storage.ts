import type { Task } from '../types';

const KEY = 'devtasks:data';

export type Stored = {
    tasks: Task[];
    dirty: string[];        // ids changed on this device and not yet sent
    since: number | null;   // server time of the last successful sync
};

export const loadStored = (): Stored => {
    try {
        const data = JSON.parse(localStorage.getItem(KEY) ?? 'null');
        if (data && Array.isArray(data.tasks)) {
            return { tasks: data.tasks, dirty: Array.isArray(data.dirty) ? data.dirty : [], since: data.since ?? null };
        }
    } catch {
        // Unreadable data: start with an empty notebook.
    }
    return { tasks: [], dirty: [], since: null };
};

export const saveStored = (data: Stored) => {
    try {
        localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
        // Storage full or blocked: the tasks stay in memory until the next sync.
    }
};
