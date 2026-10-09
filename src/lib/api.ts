import type { Task } from '../types';

export const API_URL: string = import.meta.env.VITE_API_URL
    ?? (import.meta.env.DEV ? 'http://localhost:2000' : 'https://api-tasklist.onrender.com');

export type SyncResponse = {
    serverTime: number;
    tasks: Task[];
    rejected: { id: string; reason: string }[];
};

export const syncTasks = async (deviceId: string, since: number | null, changes: Task[], signal: AbortSignal): Promise<SyncResponse> => {
    const response = await fetch(`${API_URL}/v2/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Device-Id': deviceId },
        body: JSON.stringify({ since, changes }),
        signal,
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error ?? `Erro ${response.status}`);
    return body as SyncResponse;
};
