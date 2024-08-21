/**
 * VerifyDTO
 */
export interface VerifyDTO {
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
 * UserDetailDTO
 */
export interface UserDetailDTO {
    accepted: number;
    ccfLevel: number;
    email: string;
    introduce: string;
    /**
     * 真实姓名
     */
    name: string;
    /**
     * 个性签名
     */
    sign: string;
    submitted: number;
    /**
     * 用户类型
     */
    type: number;
    uid: number;
    /**
     * 入学年份
     */
    year: number;
}

/**
 * UserSummaryDTO
 */
export interface UserSummaryDTO {
    accepted: number;
    ccfLevel: number;
    /**
     * 真实姓名
     */
    name: string;
    /**
     * 个性签名
     */
    sign: string;
    submitted: number;
    /**
     * 用户类型
     */
    type: number;
    uid: number;
    /**
     * 入学年份
     */
    year: number;
}

