import type { UserSummaryDTO } from "@/entify/user";
import { defineStore } from "pinia";

export const useUserStore = defineStore('user',{
    state(){
        return{
            isLogin: false,
            token: '',
            entry: {} as UserSummaryDTO
        }
    },
    persist: true
})

