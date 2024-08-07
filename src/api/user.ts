import request from '@/api'
import {toGetParams, toPostParams} from '@/utils'
import {useUserStore} from '@/store/user'
import {type User} from '@/entry'
import { connect, disConnect } from "@/api/ws";
import router from '@/router';

//仅请求邮件发送接口
export const userEmailService = async (email: string) => {
    return await request.get("/user/email", toGetParams({email: email}));
}

export const userLoginService = async (data: any) => {
    const userStore = useUserStore()
    userStore.token = await request.post("/user/login", toPostParams(data));
    let res2: User = await request.get("/user/detail");
    userStore.isLogin = true;
    userStore.entry = res2;
    // 然后建立websocket连接
    connect();
}

export const userLogoutService = () => {
    const userStore = useUserStore()
    userStore.isLogin = false;
    userStore.token = "";
    userStore.entry = {
        accepted: 0,
        ccfLevel: 0,
        email: "",
        introduce: "",
        sign: "",
        submitted: 0,
        type: 0,
        year: 0,
        name: "",
        uid: 0
    };
    // 然后断开ws连接
    disConnect();
    // 跳转
    router.push('/user/login');
}

export const userRegisterService = async (data: any) => {
    await request.post("/user/register", toPostParams(data));//先提交注册请求
    await userLoginService(data);//登录并获得个人信息
}

export const userForgetService = async (data: any) => {
    await request.post("/user/forget", toPostParams(data));
}