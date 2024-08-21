import request from '@/api';
import type { JudgerDTO } from '@/entify/judger';
import {toGetParams, toPostParams} from '@/utils';
export const robotCreate = async (jid: string): Promise<string> => {
    return await request.get("/robot/create", toGetParams({jid: jid}));
}

export const robotLogin = async (
    jid: string,
    uuid: string,
    username: string,
    password: string,
    code?: string
): Promise<number> => {
    const data = {
        jid: jid,
        uuid: uuid,
        username: username,
        password: password
    }
    if(code != undefined && code != ""){
        Object.assign(data, {code: code});
    }
    return await request.post("/robot/login", toPostParams(data));
}

export const robotVerify = async (jid: string, uuid: string): Promise<string> => {
    return await request.get("/robot/verify", toGetParams({jid: jid, uuid: uuid}));
}

export const robotDelete = async (jid: string, uuid: string): Promise<void> => {
    await request.get("/robot/delete", toGetParams({jid: jid, uuid: uuid}));
}

export const judgerGetList = async (): Promise<JudgerDTO[]> => {
    const res: JudgerDTO[] = await request.get("/robot/list");
    return res;
}