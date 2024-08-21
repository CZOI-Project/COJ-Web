import type { UserSummaryDTO } from "@/entify/user";

export function userPassVerify(user: UserSummaryDTO): boolean{
    return user.type >= 2;
}

export function userAdmin(user: UserSummaryDTO): boolean{
    return user.type >= 3;
}