import request from '@/api'
import {toGetParams, toPostParams} from '@/utils'
import {useUserStore} from '@/store/user'
import {connect, disConnect} from "@/api/ws";
import router from '@/router';
import type {UserDetailDTO, UserSummaryDTO, VerifyDTO} from '@/entify/user';

// 发送邮件
export const userSendEmail = async (email: string): Promise<void> => {
    return await request.get("/user/email", toGetParams({email: email}));
}

// 用户注册
export const userRegister = async (email: string, password: string, code: string): Promise<void> => {
    await request.post("/user/register", toPostParams({email: email, password: password, code: code}));//先提交注册请求
}

const setLoginStatus = async (data: UserSummaryDTO): Promise<void> => {
    const userStore = useUserStore();
    
    userStore.isLogin = true;
    userStore.entry = data;
    // 建立websocket连接
    await connect();
}

// 用户登录，自动配置store 自动启动ws
export const userLogin = async (email: string, password: string): Promise<void> => {
    interface Response extends UserSummaryDTO{
        token: string 
    }
    const res: Response = await request.post("/user/login", toPostParams({email: email, password: password}));
    const userStore = useUserStore();
    userStore.token = res.token;
    setLoginStatus(res as Omit<Response, 'token'>);
}

export const userGetVerifyList = async (): Promise<VerifyDTO[]> => {
    return await request.get("/user/getVerifyList");
}

// 获取快速验证的验证码 返回校验码
export const userQuickVerifyGetCode = async (id: number): Promise<string> => {
    return await request.get("/user/quickVerify", toGetParams({option: 0, id: id}));
}

export const userQuickVerify = async (id: number): Promise<void> => {
    const res: UserSummaryDTO = await request.get("/user/quickVerify", toGetParams({option: 1, id: id}));
    await setLoginStatus(res);
}

export const userVerify = async (code: string, name: string): Promise<void> => {
    const res: UserSummaryDTO = await request.get("/user/verify", toGetParams({code: code, name: name}));
    await setLoginStatus(res);
}

export const userUpdate = async (sign?: string, introduce?: string): Promise<void> => {
    const data = {};
    if(sign){
        Object.assign(data, {sign: sign});
    }
    if(introduce){
        Object.assign(data, {introduce: introduce});
    }
    await request.post("/user/update", toPostParams(data));
}

export const userDetail = async (uid: number): Promise<UserDetailDTO> => {
    return await request.get("/user/detail", toGetParams({uid: uid}));
}

export const userForget = async (email: string, password: string, code: string): Promise<void> => {
    await request.post("/user/forget", toPostParams({email: email, password: password, code: code}));
}

export const userLogout = async () => {
    const userStore = useUserStore()
    userStore.isLogin = false;
    userStore.token = "";
    userStore.entry = {} as UserSummaryDTO;
    // 然后断开ws连接
    disConnect();
    // 跳转
    await router.push('/user/login');
}


export const userAvatarUpdate = async (data: Blob): Promise<void> => {
    const formData = new FormData();
    formData.append('file', data);
    await request.post('/user/uploadAvatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export const userBackgroundUpdate = async (data: Blob): Promise<void> => {
    const formData = new FormData();
    formData.append('file', data);
    await request.post('/user/updateBackground', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}