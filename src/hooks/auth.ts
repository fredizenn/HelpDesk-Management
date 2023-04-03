import { writable } from "svelte/store";

const user = 'fredakuffoboafo@gmail.com'
const pass = '123456'

export const store = writable();


export const getUserDetails = async (username: any, password: any) => {
    if(username === user && password === pass)
    return 1
}

