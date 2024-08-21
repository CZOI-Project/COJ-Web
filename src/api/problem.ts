import request from '@/api'
import type {DescriptionPO, ProblemDetailDTO, ProblemQuery, ProblemSummaryDTO, Subtask} from '@/entify/problem';
import {toGetParams} from '@/utils'
import {toPostParams} from '../utils/index';

export const problemDelete = async (pid: string): Promise<void> => {
    await request.get("/problem/delete", toGetParams({pid: pid}));
}

export const problemSearch = async (data: ProblemQuery): Promise<[number, ProblemSummaryDTO[]]> => {
    interface Response {
        count: number,
        problems: ProblemSummaryDTO[]
    }
    const res: Response = await request.get("/problem/list", toGetParams(data));
    return [res.count, res.problems];
}

export const problemDetail = async (pid: string, cid?: number): Promise<ProblemDetailDTO> => {
    const data = {pid: pid};
    if(cid){
        Object.assign(data, {cid: cid});
    }
    const res: ProblemDetailDTO = await request.get("/problem/detail", toGetParams(data));
    return res;
}

export const problemCreate = async (
    pid: string, 
    title: string, 
    origin: string, 
    difficulty: number
): Promise<void> => {
    const data = {type: 0, pid: pid, title: title, origin: origin, difficulty: difficulty};
    await request.post("/problem/update", toPostParams(data));
}

export const problemUpdate = async (
    pid: string,
    title?: string,
    origin?: string,
    difficulty?: number
): Promise<void> => {
    const data = {type: 1, pid: pid};
    if(title) Object.assign(data, {title: title});
    if(origin) Object.assign(data, {origin: origin});
    if(difficulty) Object.assign(data, {difficulty: difficulty});
    await request.post("/problem/update", toPostParams(data));
}

export const tagAdd = async (pid: string, tid: number): Promise<void> => {
    await request.post("/problem/update", toPostParams({type: 2, pid: pid, tid: tid}));
}

export const tagDelete = async (pid: string, tid: number): Promise<void> => {
    await request.post("/problem/update", toPostParams({type: 3, pid: pid, tid: tid}));
}

export const descriptionDelete = async (did: number): Promise<void> => {
    await request.get("/problem/description/delete", toGetParams({did: did}))
}

export const descriptionCreate = async (
    pid: string,
    lang: string,
    author: string,
    content: string
): Promise<void> => {
    const res = {
        pid: pid,
        lang: lang,
        author: author,
        content: content
    }
    await request.post("/problem/description/update", toPostParams(res));
}

export const descriptionUpdate = async (
    did: number,
    pid?: string,
    lang?: string,
    author?: string,
    content?: string
): Promise<void> => {
    const data = {did: did};
    if(pid) Object.assign(data, {pid: pid});
    if(lang) Object.assign(data, {lang: lang});
    if(author) Object.assign(data, {author: author});
    if(content) Object.assign(data, {content: content});
    await request.post("/problem/description/update", toPostParams(data));
}

// 返回提交记录id
export const problemSubmit = async (pid: string, code: string, cid?: number): Promise<number> => {
    const data = {pid: pid, code: code};
    if(cid) Object.assign(data, {cid: cid});
    return await request.post("/problem/submit", toPostParams(data));
}

// 获取测试点信息
export const subtaskDetail = async (pid: string): Promise<Subtask[]> => {
    return await request.get("/problem/subtask/detail", toGetParams({pid: pid}));
}

export const subtaskUpdate = async (pid: string, json: string): Promise<void> => {
    await request.post("/problem/subtask/update", toPostParams({pid: pid, json: json}));
}
