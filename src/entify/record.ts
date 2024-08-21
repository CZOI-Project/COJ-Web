import type { ContestSummaryDTO } from "./contest";
import type { ProblemSummaryDTO } from "./problem";
import type { UserSummaryDTO } from "./user";

/**
 * RecordSummaryDTO
 */
export interface RecordSummaryDTO {
    contest?: ContestSummaryDTO;
    /**
     * 代码长度，单位字节，unshown且不是自己的提交记录时隐藏
     */
    length?: number;
    problem: ProblemSummaryDTO;
    /**
     * 评测记录id
     */
    rid: number;
    /**
     * 总使用内存，通过测试点信息计算出来，单位kb unshown隐藏
     */
    runMem?: number;
    /**
     * 总使用时间，通过测试点信息计算出来，单位ms unshown隐藏
     */
    runTime?: number;
    // unshown隐藏
    score?: number;
    /**
     * 评测记录状态，如果是unshown为true则会遮盖该字段
     * 1-waiting，当存在测试点是waiting时
     * 2-judging，当存在测试点是judging时
     * 3-se，当存在测试点时se时
     * 4-unaccepted，当存在测试点不是ac时
     * 5-accepted，所有测试点都ac时
     * unshown隐藏
     */
    status?: number;
    /**
     * 创建时间
     */
    time: string;
    /**
     * 是否屏蔽，一般是比赛时提交的评测会设置Unshown
     */
    unshown: number;
    /**
     * 提交者
     */
    user: UserSummaryDTO;
}

/**
 * RecordDetailDTO
 */
export interface RecordDetailDTO {
    /**
     * 测试点信息，map类型，key为测试点编号，value为测试点信息 unshown评测记录隐藏
     */
    checkpoints?: Map<number, CheckpointToRecord>;
    /**
     * 提交代码 unshown且非自己的提交记录隐藏
     */
    code?: string;
    contest?: ContestSummaryDTO;
    /**
     * 代码长度，单位字节 unshown且非自己的提交记录
     */
    length?: number;
    /**
     * 日志
     */
    log?: string;
    problem: ProblemSummaryDTO;
    /**
     * 评测记录id
     */
    rid: number;
    /**
     * 总使用内存，通过测试点信息计算出来，单位kb
     */
    runMem?: number;
    /**
     * 总使用时间，通过测试点信息计算出来，单位ms
     */
    runTime?: number;
    score?: number;
    /**
     * 评测记录状态，如果是unshown为true则会遮盖该字段
     * 1-waiting，当存在测试点是waiting时
     * 2-judging，当存在测试点是judging时
     * 3-se，当存在测试点时se时
     * 4-unaccepted，当存在测试点不是ac时
     * 5-accepted，所有测试点都ac时
     */
    status?: number;
    subtasks?: Array<number[]>;
    /**
     * 创建时间
     */
    time: string;
    /**
     * 投递信息，json字符串
     */
    traces?: Trace[];
    /**
     * 是否屏蔽，一般是比赛时提交的评测会设置Unshown
     */
    unshown: number;
    /**
     * 提交者
     */
    user: UserSummaryDTO;
}

/**
 * CheckpointToRecord
 */
export interface CheckpointToRecord {
    /**
     * 测试点序号，从0开始
     */
    id: number;
    /**
     * 测试点的提示信息
     */
    message: string;
    /**
     * 运行内存
     */
    runMem: number;
    /**
     * 运行时间
     */
    runTime: number;
    /**
     * 该测试点得分
     */
    score: number;
    /**
     * 评测状态，0-waiting，正在等待
     * 1-judging，正在评测
     * 2-accepted，AC
     * 3-wrong answer，WA
     * 4-time limit error，TLE
     * 5-memory limit error，MLE
     * 6-runtime error，RE
     * 7-unknown error，UKE
     * 8-partial correct，PC，部分正确，仅得部分分
     * 9-system error，执行过程中发生错误，错误信息可在message中查看
     * 10-compiler error，CE，编译错误
     */
    status: number;
    /**
     * 对应的subtask id
     */
    subtask: number;
}

/**
 * Trace
 */
export interface Trace {
    /**
     * 影响的测试点编号
     */
    ids: number[];
    /**
     * 状态，0-成功被揽收
     * 1-目标juger未上线
     * 2-找不到匹配的robot
     */
    status: number;
    /**
     * 揽收的robot的用户名，status为0时可用
     */
    username?: string;
    /**
     * 揽收的robot的uuid，status为0时可用
     */
    uuid?: string;
    jid: string;
}

export interface RecordQuery {
    count: number,
    index: number,
    key: number,
    order: number,
    pid?: string,
    uid?: number,
    cid?: number,
    status?: string,
    name?: string
}