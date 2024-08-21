import type { ProblemSummaryDTO } from "./problem";

/**
 * ContestDetailDTO
 */
export interface ContestDetailDTO {
    /**
     * 比赛的id
     */
    cid: number;
    /**
     * 比赛结束时间
     */
    endTime: string;
    /**
     * 比赛详情，markdown格式
     */
    introduce: string;
    /**
     * 比赛名称
     */
    name: string;
    /**
     * 部分参加者，仅提供他们的uid，最多给5个，方便前端获得头像信息
     */
    partialParticipants: number[];
    /**
     * 参加比赛的人数量
     */
    participantsCount: number;
    /**
     * 是否报名了
     */
    participate: number;
    /**
     * 题目列表 比赛未开始时隐藏
     */
    problems?: ProblemSummaryDTO[];
    showRank: number;
    showResult: number;
    /**
     * 比赛开始时间
     */
    startTime: string;
    /**
     * 比赛的类型，0-默认
     * 1-oi赛制
     */
    type: number;
}

/**
 * ContestSummaryDTO
 */
export interface ContestSummaryDTO {
    /**
     * 比赛的id
     */
    cid: number;
    /**
     * 比赛结束时间
     */
    endTime: string;
    /**
     * 比赛名称
     */
    name: string;
    /**
     * 部分参加者，仅提供他们的uid，最多给5个，方便前端获得头像信息
     */
    partialParticipants: number[];
    /**
     * 参加比赛的人数量
     */
    participantsCount: number;
    /**
     * 是否报名了
     */
    participate: number;
    showRank: number;
    showResult: number;
    /**
     * 比赛开始时间
     */
    startTime: string;
    /**
     * 比赛的类型，0-默认
     * 1-oi赛制
     */
    type: number;
}

