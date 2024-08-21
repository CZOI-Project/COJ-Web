/**
 * JudgerDTO
 */
export interface JudgerDTO {
    /**
     * id
     */
    jid: string;
    /**
     * 名称
     */
    name: string;
    robots: RobotDTO[];
    /**
     * 活跃时间
     */
    updateTime: string;
}

/**
 * RobotDTO
 */
export interface RobotDTO {
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