import {defineStore} from "pinia";


export const useGlobalStore = defineStore({
    id: 'global',
    state: () => ({
        error_message: {
            location: '',
            detail: '',
            show: false
        },
        loading: false,
        ws: {
            isConnected: false,
            socket: {} as WebSocket,
            events: new Map()
        }
    }),
    persist: false
});

