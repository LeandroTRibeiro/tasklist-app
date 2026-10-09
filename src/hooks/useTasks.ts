import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { syncTasks, type SyncResponse } from '../lib/api';
import { getDeviceId, saveDeviceId } from '../lib/device';
import { loadStored, saveStored, type Stored } from '../lib/storage';
import { LIMITS, type SyncStatus, type Task } from '../types';

const SYNC_DELAY = 800;          // waits for a burst of edits before syncing
const WAKING_AFTER = 2500;       // a slow answer means Render's free plan is starting the server
const REQUEST_TIMEOUT = 90_000;  // waking up can take about a minute
const POLL_EVERY = 60_000;

// Applies the server's answer: the newest version of each task wins, and anything
// edited while the request was in flight stays queued for the next sync.
const merge = (current: Stored, response: SyncResponse, sent: Task[]): Stored => {
    const byId = new Map(current.tasks.map(t => [t.id, t]));
    const sentAt = new Map(sent.map(t => [t.id, t.updatedAt]));
    const rejected = new Set(response.rejected.map(r => r.id));
    const dirty = new Set(current.dirty.filter(id => {
        const local = byId.get(id);
        const at = sentAt.get(id);
        return !rejected.has(id) && !(local && at !== undefined && local.updatedAt <= at);
    }));
    for (const remote of response.tasks) {
        const local = byId.get(remote.id);
        if (local && dirty.has(remote.id) && local.updatedAt > remote.updatedAt) continue;
        byId.set(remote.id, remote);
    }
    // A deletion is forgotten locally once the server has it.
    const tasks = [...byId.values()].filter(t => !(t.deleted && !dirty.has(t.id)));
    return { tasks, dirty: [...dirty], since: response.serverTime };
};

export function useTasks() {
    const [data, setData] = useState<Stored>(loadStored);
    const [status, setStatus] = useState<SyncStatus>(navigator.onLine ? 'idle' : 'offline');
    const [notice, setNotice] = useState<string | null>(null);
    const [deviceId, setDeviceId] = useState(getDeviceId);

    const dataRef = useRef(data);
    dataRef.current = data;
    const deviceRef = useRef(deviceId);
    const busy = useRef(false);
    const again = useRef(false);
    const timer = useRef<number | undefined>(undefined);
    const syncRef = useRef<() => Promise<void>>(async () => {});

    useEffect(() => saveStored(data), [data]);

    const schedule = useCallback(() => {
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => void syncRef.current(), SYNC_DELAY);
    }, []);

    syncRef.current = async () => {
        if (!navigator.onLine) {
            setStatus('offline');
            return;
        }
        if (busy.current) {
            again.current = true;
            return;
        }
        busy.current = true;
        const snapshot = dataRef.current;
        const pending = new Set(snapshot.dirty);
        const sent = snapshot.tasks.filter(t => pending.has(t.id));
        // Background checks with nothing to send stay quiet unless the server is slow to answer.
        if (sent.length || snapshot.since === null) setStatus('syncing');
        const waking = window.setTimeout(() => setStatus('waking'), WAKING_AFTER);
        const controller = new AbortController();
        const abort = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
        try {
            const response = await syncTasks(deviceRef.current, snapshot.since, sent, controller.signal);
            setData(current => merge(current, response, sent));
            setNotice(response.rejected.length
                ? `${response.rejected.length === 1 ? 'Uma tarefa não sincronizou' : `${response.rejected.length} tarefas não sincronizaram`}: ${response.rejected[0].reason}`
                : null);
            setStatus('idle');
        } catch {
            setStatus(navigator.onLine ? 'error' : 'offline');
        } finally {
            window.clearTimeout(waking);
            window.clearTimeout(abort);
            busy.current = false;
            if (again.current) {
                again.current = false;
                schedule();
            }
        }
    };

    useEffect(() => {
        void syncRef.current();
        const sync = () => void syncRef.current();
        const offline = () => setStatus('offline');
        const visible = () => document.visibilityState === 'visible' && sync();
        const poll = window.setInterval(visible, POLL_EVERY);
        window.addEventListener('online', sync);
        window.addEventListener('offline', offline);
        document.addEventListener('visibilitychange', visible);
        return () => {
            window.clearInterval(poll);
            window.clearTimeout(timer.current);
            window.removeEventListener('online', sync);
            window.removeEventListener('offline', offline);
            document.removeEventListener('visibilitychange', visible);
        };
    }, []);

    // Every local change is saved right away and queued for the server.
    const change = useCallback((ids: string[], update: (tasks: Task[]) => Task[]) => {
        setData(current => ({ ...current, tasks: update(current.tasks), dirty: [...new Set([...current.dirty, ...ids])] }));
        schedule();
    }, [schedule]);

    const add = useCallback((title: string) => {
        const now = Date.now();
        const task: Task = { id: crypto.randomUUID(), title: title.trim().slice(0, LIMITS.title), description: '', done: false, deleted: false, createdAt: now, updatedAt: now };
        change([task.id], tasks => [task, ...tasks]);
    }, [change]);

    const edit = useCallback((id: string, patch: Partial<Pick<Task, 'title' | 'description' | 'done' | 'deleted'>>) => {
        change([id], tasks => tasks.map(t => (t.id === id ? { ...t, ...patch, updatedAt: Date.now() } : t)));
    }, [change]);

    // Adopts another device's code: this device's tasks join that list.
    const switchCode = useCallback((code: string) => {
        const id = code.trim().toLowerCase();
        saveDeviceId(id);
        deviceRef.current = id;
        setDeviceId(id);
        setData(current => ({ ...current, dirty: current.tasks.filter(t => !t.deleted).map(t => t.id), since: null }));
        schedule();
    }, [schedule]);

    const tasks = useMemo(() => data.tasks.filter(t => !t.deleted), [data.tasks]);

    return {
        tasks,
        unsynced: data.dirty.length,
        status,
        notice,
        dismissNotice: () => setNotice(null),
        deviceId,
        add,
        edit,
        switchCode,
        syncNow: () => void syncRef.current(),
    };
}
