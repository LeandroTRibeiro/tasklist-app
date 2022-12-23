import axios from "axios";

const BASEAPI = 'https://api-tasklist.onrender.com';

export const Api = {
    getAllTasks: async () => {
        const response = await axios.get(`${BASEAPI}/tasks`);
        return response.data;
    },
    createTask: async (title: string, description: string) => {
        const response = await axios.post(`${BASEAPI}/tasks`, {
            title,
            description
        });
        return response.data;
    },
    deleteTask: async (_id: string) => {

        const response = await axios.delete(`${BASEAPI}/task/${_id}`);

        return response.data;
    },
    updateTask: async (_id: string, title: string, description: string) => {

        const response = await axios.put(`${BASEAPI}/task/${_id}`, {
            title,
            description
        });

        return response.data;
    },
    updateDone: async (_id: string, title: string, done: boolean) => {
        const response = await axios.put(`${BASEAPI}/task/${_id}`, {
            title,
            done
        });

        return response.data;
    },
    searchTask: async (query: string) => {
        const response = await axios.get(`${BASEAPI}/task/${query}`);

        return response.data;
    }
}