import { supabase } from "@/lib/supabase";

export const getCurrentUser = async () => {
    const {
        data: { user }
    } = await supabase.auth.getUser();

    return user;
};

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const randomBetween = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const setLocalStorageItem = (key: string, value: any) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStorageItem = (key: string) => {
    if (typeof window === "undefined") return null;

    const item = localStorage.getItem(key);
    if (item) {
        try {
            return JSON.parse(item);
        } catch (error) {
            console.error(`Error parsing localStorage key "${key}":`, error);
            return null;
        }
    }
    return null;
};
