// localStorageUtils.js
import { fetchRemoteData, updateRemoteData } from './DatabaseService';

export const dataKeys = {
    EMPLOYEES: 'employees',
    CLIENTS: 'clients',
    TASKS: 'tasks',
    PLAYBOOKS: 'playbooks',
    TASK_HISTORY: 'task_history',
    MEETINGS: 'meetings',
};

// Function to initialize LocalStorage with default empty arrays if keys are not present and local storage is empty
export const initializeLocalStorage = async () => {
    if (Object.keys(localStorage).length === 0) {
        const defaultEmployees = [
            {
                id: 1,
                name: "John Doe",
                color: "#4F46E5",
                profile_picture: "https://i.pravatar.cc/150?img=1"
            },
            {
                id: 2,
                name: "Jane Smith",
                color: "#7C3AED",
                profile_picture: "https://i.pravatar.cc/150?img=2"
            }
            // Add more default employees as needed
        ];

        await Promise.all(
            Object.values(dataKeys).map(async key => {
                if (key === dataKeys.EMPLOYEES) {
                    localStorage.setItem(key, JSON.stringify(defaultEmployees));
                } else {
                    const remoteData = await fetchRemoteData(key);
                    localStorage.setItem(key, JSON.stringify(remoteData || []));
                }
            })
        );
    }
};

// Function to set data in localStorage
export const setData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
    // Async update to remote
    updateRemoteData(key, data);
};

// Function to get data from localStorage
export const getData = (key) => {
    const local = localStorage.getItem(key);
    // Optionally, you could have a more advanced sync strategy.
    return local ? JSON.parse(local) : null;
};

// Function to delete data from localStorage
export const deleteData = (key) => {
    localStorage.removeItem(key);
};
