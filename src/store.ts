import axios from "axios";
import { writable } from "svelte/store";

export const loggedIn = writable(false);

export const token = writable('');

export const axiosInstance =  axios.create({
    baseURL: 'https://localhost:7085/api',
    headers: {
        'Authorization': `Bearer ${token}`
    }
});