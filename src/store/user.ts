import { defineStore } from "pinia";
import { type User } from "@/entry";

export const useUserStore = defineStore('user',{
    state(){
        return{
            isLogin: false,
            token: '',
            entry: {} as User
        }
    },
    persist: true
})

