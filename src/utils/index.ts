export const toPostParams = (obj: unknown)=>{
    const params = new URLSearchParams()
    for(const key in obj){
        params.append(key,obj[key])
    }
    return params
}

export const toGetParams = (obj: unknown)=>{
    return { params: obj }
}

// 将数字格式化
export const getNumText = (num: number)=>{
    if(num >= 1000){
        const a = num / 1000;
        a.toFixed(1);
        return a.toString() + 'K';
    }
    return num.toString();
}

export const arrayToText = (arr: unknown[])=>{
    let flag = false;
    let res = '';
    for(const i of arr){
        //console.log("aa",i);
        if(!flag){
            res += i;
            flag = true;
        }else{
            res+=","+i;
        }
    }
    return res;
}

// 获取距现在的时间（简略）
export const getTimeText = (text: string)=>{
    const str = text.replace(' ','T');
    const time = new Date(str);
    const currentTime = new Date();
    const d = Math.floor((currentTime - time)/1000);
    if(d < 60){
        return d + "秒";
    }else if(d <= 60*60){
        return Math.floor(d / 60) + "分钟";
    }else if(d <= 60*60*24){
        return Math.floor(d / (60*60)) + "小时";
    }else{
        return Math.floor(d / (60*60*24)) + "天";
    }
}

export const getRobotStatusText = (status: number)=>{
    if(status == -3) return "已创建";
    if(status == -2) return "需要验证";
    if(status == -1) return "发生错误";
    if(status == 0) return "离线";
    if(status == 1) return "准备就绪";
    if(status == 2) return "正在评测";
}

export const getScoreColor = (num: number) => {
    if(num >= 80) return "green";
    else if(num >= 60) return "light-green";
    else if(num >= 40) return "lime";
    else if(num >= 20) return "deep-orange";
    else return "red";
}

export const formatNumber = (num: number) => {
    // 判断数字是否已经有小数部分
    if (Math.floor(num) !== num) {
        // 如果有小数部分，保留一位小数
        return parseFloat(num.toFixed(1));
    } else {
        // 如果没有小数部分，保留整数
        return Math.trunc(num);
    }
}

export const getCodeLengthText = (num: number) => {
    if(num <= 1024) return num + "B";
    else return formatNumber(num/1024) + "KB";
}

export const getTimeText2 = (num: number) => {
    if(num <= 9999) return num + "ms";
    else return formatNumber(num/1000) + "s";
}

export const getMemText = (num: number) => {
    if(num <= 999) return num + "KB";
    else return formatNumber(num/1024) + "MB";
}

export const getMemText2 = (num: number) => {
    if(num <= 999) return num + "B";
    else return formatNumber(num/1024) + "KB";
}

export const canBeConvertedToNumber = (str:string) => {
    // 尝试将字符串转换为数字
    const num = Number(str);
    // 如果转换后的结果是 NaN，则说明原字符串不能被转换为数字
    return !isNaN(num) && isFinite(num);
}

export const parseDateTime = (dateStr: string) => {
    dateStr.replace(' ', 'T');
    return new Date(dateStr);
}

export const daysUntil = (targetDate: Date) => {
    const now = new Date();
    const diffMilliseconds = targetDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMilliseconds / (1000 * 60 * 60 * 24)); // 转换为天数

    return diffDays;
}

export function listToString<E>(list: E[]): string {
    let str = "[ ";
    for (let i = 0; i < list.length; i++) {
        const e = list[i];
        if (i !== list.length - 1) {
            str += e.toString() + ", ";
        } else {
            str += e.toString();
        }
    }
    str += " ]";
    return str;
}