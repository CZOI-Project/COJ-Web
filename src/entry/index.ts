/**
 * User
 */
export interface User {
    /**
     * 通过数
     */
    accepted: number;
    /**
     * ccf等级
     */
    ccfLevel: number;
    /**
     * 绑定邮箱
     */
    email: string;
    /**
     * 个人介绍
     */
    introduce?: string;
    /**
     * 真实姓名，type为1的用户不存在
     */
    name: string;
    /**
     * 个人签名
     */
    sign: string;
    /**
     * 提交数
     */
    submitted: number;
    /**
     * 用户类型
     */
    type: number;
    /**
     * 用户id，按用户注册顺序分发
     */
    uid: number;
    /**
     * 入学年份，type为1的用户不存在
     */
    year: number;
}

/**
 * VerifyEntry
 */
export interface VerifyEntry {
    /**
     * id
     */
    id: number;
    /**
     * 真实姓名，通过身份验证后将用户的name置为该name
     */
    name: string;
    /**
     * 验证目标，目前只有洛谷验证，所以该值为洛谷的uid
     */
    target: string;
    /**
     * 入学年份，通过身份验证后将用户的year置为该year
     */
    year: number;
}

/**
 * Problem
 */
export interface Problem {
    /**
     * 通过数
     */
    accepted: number;
    /**
     * 关联的比赛，如果没有关联就为空
     */
    contest?: ContestLess;
    /**
     * 题目描述，coj提供多种题目描述
     */
    descriptions: Description[];
    /**
     * 题目难度
     */
    difficulty: number;
    /**
     * 题目来源
     */
    origin: string;
    /**
     * 题目id
     */
    pid: string;
    /**
     * 我的题目状态，0-默认
     * 1-unaccepted
     * 2-accepted
     * 3-submitted 已经提交，用于OI赛制比赛
     */
    status: ProblemStatus;
    /**
     * 提交数
     */
    submitted: number;
    /**
     * 子任务
     */
    subtasks: Subtask[];
    /**
     * 题目标签
     */
    tags: number[];
    /**
     * 标题
     */
    title: string;
}

/**
 * ProblemStatus
 */
export interface ProblemStatus {
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
 * 关联的比赛，如果没有关联就为空
 *
 * ContestLess
 */
export interface ContestLess {
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
     * 比赛开始时间
     */
    startTime: string;
    /**
     * 比赛的类型，1-IOI赛制
     * 2-OI赛制
     */
    type: number;
}

/**
 * Description
 */
export interface Description {
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
    did?: number;
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
     * 内存限制，单位kb，注意，内存和时间限制需要与远程题目对应的一致，否则无法达到效果
     */
    memoryLimit: number;
    /**
     * 远程题目测试点编号
     */
    nth: number;
    /**
     * 该测试点分数
     */
    score: number;
    /**
     * 远程题目特征
     */
    target: string;
    /**
     * 时间限制，单位ms
     */
    timeLimit: number;
}

/**
 * Record
 */
export interface Record {
    /**
     * 测试点信息
     */
    checkpoints?: CheckpointToRecord[];
    /**
     * 关联的比赛
     */
    cid?: number;
    /**
     * 提交代码
     */
    code?: string;
    /**
     * 代码长度，单位字节
     */
    length: number;
    /**
     * 日志
     */
    log?: string;
    /**
     * 对应的题目
     */
    pid: string;
    /**
     * 评测记录id
     */
    rid: number;
    /**
     * 总使用内存，通过测试点信息计算出来，单位kb
     */
    runMem: number;
    /**
     * 总使用时间，通过测试点信息计算出来，单位ms
     */
    runTime: number;
    /**
     * 评测记录状态，如果是unshown为true则会遮盖该字段
     * 1-waiting，当存在测试点是waiting时
     * 2-judging，当存在测试点是judging时
     * 3-se，当存在测试点时se时
     * 4-unaccepted，当存在测试点不是ac时
     * 5-accepted，所有测试点都ac时
     */
    status: number;
    /**
     * 创建时间
     */
    time: string;
    /**
     * 投递信息
     */
    traces?: Trace[];
    /**
     * 发起者
     */
    uid: number;
    /**
     * 是否屏蔽
     */
    unshown: boolean;
    score: number;
}

/**
 * CheckpointToRecord
 */
export interface CheckpointToRecord {
    /**
     * 测试点序号，ID 编号
     */
    id: number;
    message: string;
    myMem: number;
    /**
     * 评测后该测试点的得分
     */
    myScore: number;
    myTime: number;
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
}

/**
 * Trace
 */
export interface Trace {
    /**
     * 测试点编号
     */
    id: number;
    /**
     * status为3时可用
     */
    message: string;
    /**
     * 状态，0-成功被揽收
     * 1-目标judger未上线
     * 2-没有可用的robot
     * 其他错误请通过日志发送，并将测试点置为
     */
    status: number;
    /**
     * 揽收的robot的用户名，status为0时可用
     */
    username: string;
    /**
     * 揽收的robot的uuid，status为0时可用
     */
    uuid: string;
}

/**
 * Judger
 */
export interface Judger {
    /**
     * id
     */
    jid: string;
    /**
     * 名称
     */
    name: string;
    remote: string;
    robots: Robot[];
    type: number;
    /**
     * 活跃时间
     */
    updateTime: string;
}

/**
 * Robot
 */
export interface Robot {
    /**
     * 爬虫密码
     */
    password: string;
    /**
     * 当前状态，-3-仅创建，未绑定账号密码
     * -2-登录需要验证
     * -1-发生错误（登陆时出错，密码错误等）
     * 0-离线
     * 1-在线，准备就绪
     * 2-正在评测
     */
    status: number;
    /**
     * 爬虫账号
     */
    username: string;
    /**
     * 唯一标识符
     */
    uuid: string;
}

/**
 * Contest
 */
export interface Contest {
    /**
     * 比赛的id
     */
    cid: number;
    /**
     * 比赛结束时间
     */
    endTime: string;
    /**
     * 比赛介绍，markdown格式
     */
    introduce: string;
    /**
     * 关键提交记录，通过关键提交记录和参与者，即可计算出各种统计信息
     */
    keyRecord: Record[];
    /**
     * 比赛名称
     */
    name: string;
    /**
     * 参与者
     */
    participants: User[];
    /**
     * 比赛题目
     */
    problems: Problem[];
    /**
     * 比赛开始时间
     */
    startTime: string;
    /**
     * 比赛的类型，1-IOI赛制
     * 2-OI赛制
     */
    type: number;
}