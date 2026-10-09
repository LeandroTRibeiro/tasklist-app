const KEY = 'devtasks:device';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const isDeviceCode = (value: string) => UUID.test(value.trim());

// The device's secret code: every device using the same code sees the same tasks.
export const getDeviceId = () => {
    let id = localStorage.getItem(KEY);
    if (!id || !isDeviceCode(id)) {
        id = crypto.randomUUID();
        localStorage.setItem(KEY, id);
    }
    return id;
};

export const saveDeviceId = (id: string) => localStorage.setItem(KEY, id);
