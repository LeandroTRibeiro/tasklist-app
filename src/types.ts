export type Task = {
    id: string;
    title: string;
    description: string;
    done: boolean;
    deleted: boolean;   // kept until the deletion reaches the server
    createdAt: number;
    updatedAt: number;  // the newest edit wins when devices disagree
};

export type Filter = 'all' | 'todo' | 'done';

export type SyncStatus = 'idle' | 'syncing' | 'waking' | 'offline' | 'error';

export const LIMITS = { title: 120, description: 500 };
