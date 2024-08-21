import type { ContestSummaryDTO } from "./contest";

/**
 * ProblemSummaryDTO
 */
export interface ProblemSummaryDTO {
    /**
     * 通过数，比赛题目会隐藏
     */
    accepted: number;
    /**
     * 题目难度
     */
    difficulty: number;
    /**
     * 最高空间限制
     */
    memHigh: number;
    /**
     * 最低空间限制
     */
    memLow: number;
    /**
     * 题目来源
     */
    origin: string;
    /**
     * 题目id
     */
    pid: string;
    /**
     * 用户这道题的状态
     */
    status: ProblemStatusPO;
    /**
     * 提交数
     */
    submitted: number;
    tags: number[];
    /**
     * 最高时限
     */
    timeHigh: number;
    /**
     * 最低时限
     */
    timeLow: number;
    /**
     * 标题
     */
    title: string;
}

/**
 * 用户这道题的状态
 *
 * ProblemStatusPO
 */
export interface ProblemStatusPO {
    /**
     * 获得分数
     */
    score: number;
    /**
     * 是否收藏了这个题目
     */
    star: number;
    /**
     * 题目状态，0-默认
     * 1-unaccepted
     * 2-accepted
     * 3-submitted 已经提交，用于OI赛制比赛
     */
    status: number;
}

/**
 * ProblemDetailDTO
 */
export interface ProblemDetailDTO {
    /**
     * 通过数, 比赛题目隐藏
     */
    accepted?: number;
    /**
     * 关联比赛，可为空
     */
    contest?: ContestSummaryDTO;
    descriptions: DescriptionPO[];
    /**
     * 题目难度
     */
    difficulty: number;
    /**
     * 最高空间限制
     */
    memHigh: number;
    /**
     * 最低空间限制
     */
    memLow: number;
    /**
     * 题目来源
     */
    origin: string;
    /**
     * 题目id
     */
    pid: string;
    /**
     * 用户这道题的状态
     */
    status: ProblemStatusPO;
    /**
     * 提交数 位于比赛中时隐藏
     */
    submitted?: number;
    tags: number[];
    /**
     * 最高时限
     */
    timeHigh: number;
    /**
     * 最低时限
     */
    timeLow: number;
    /**
     * 标题
     */
    title: string;
}

/**
 * DescriptionPO
 */
export interface DescriptionPO {
    /**
     * 提供者
     */
    author: string;
    /**
     * 题目内容，使用markdown格式
     */
    content: string;
    /**
     * 题目描述id
     */
    did: number;
    /**
     * 语言
     */
    lang: string;
    /**
     * 对应的题目id
     */
    pid: string;
    /**
     * 更新时间
     */
    time: string;
}

export interface ProblemQuery {
    index: number, 
    count: number, 
    order: number, 
    pid: number,
    difficulty?: string, // 已经处理的字符串
    key?: string, 
    tags?: string // 已经处理的字符串
}

/**
 * Subtask
 */
export interface Subtask {
    /**
     * 包含的测试点
     */
    checkpoints: CheckpointToProblem[];
    /**
     * 该子任务的分数
     */
    score: number;
    /**
     * 计分方式，1：当前子任务的分数被测试点平分，确保能被整除，否则该子任务无法得到满分。在这种类型下，测试点自行设置的分数是无效的
     * 2：取当前子任务下得分最高的测试点的分数
     * 3：取当前子任务下得分最低的测试点的分数
     * 对于上述两种情况，子任务设置的分数是无效的
     * 4：单纯将测试点分数相加
     * 对于上述一种情况，子任务如果设置分数，则最后得分不会大于该数值
     * 特别地，如果该子任务的分数设置为0，则该子任务不参与计分
     *
     * 题目的总分会根据上述规则进行计算
     * 注意，即使获得了满分，如果有一个测试点没有通过，那么该题目也会是unaccepted
     */
    type: number;
}

/**
 * CheckpointToProblem
 */
export interface CheckpointToProblem {
    /**
     * 提交给judger时附带信息，一般包含编译器参数等信息
     */
    extra: string;
    /**
     * 测试点序号
     */
    id: number;
    /**
     * 该测试点所用到的judger的id
     */
    jid: string;
    /**
     * 内存限制，单位kb，注意，内存和时间限制需要与远程题目对应的一致。一般没什么用，仅供在页面呈现，或者看judger怎么处理
     */
    memLimit: number;
    /**
     * 远程题目测试点编号
     */
    nth: number;
    /**
     * 该测试点分数
     */
    score: number;
    /**
     * 远程题目题号
     */
    target: string;
    /**
     * 时间限制，单位ms
     */
    timeLimit: number;
}