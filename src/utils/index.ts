export const toPostParams = (obj: any)=>{
    let params = new URLSearchParams()
    for(let key in obj){
        params.append(key,obj[key])
    }
    return params
}

export const toGetParams = (obj: any)=>{
    return {params:obj}
}

export const getNumText = (num: any)=>{
    if(typeof num == 'undefined') return;
    if(num >= 1000){
        let a = num / 1000;
        a.toFixed(1);
        return a.toString() + 'K';
    }
    return num.toString();
}

export const getDifficultyColor = (value: number)=>{
    if(value == 0) return 'text-grey';
    if(value == 1) return 'text-pink';
    if(value == 2) return 'text-amber';
    if(value == 3) return 'text-yellow-darken-1';
    if(value == 4) return 'text-green';
    if(value == 5) return 'text-blue';
    if(value == 6) return 'text-purple';
    if(value == 7) return 'text-black';
    return 'coj-difficulty-'+value;
}

export const getDifficultyText = (value: number)=>{
    if(value==0){
        return "暂无评定";
    }
    if(value==1){
        return "入门";
    }
    if(value==2){
        return "普及-";
    }
    if(value==3){
        return "普及/提高-";
    }
    if(value==4){
        return "普及+/提高";
    }
    if(value==5){
        return "提高+/省选-";
    }
    if(value==6){
        return "省选/NOI-";
    }
    if(value==7){
        return "NOI/NOI+/CTSC";
    }
}

export const arrayToText = (arr: any)=>{
    let flag = false;
    let res = '';
    for(let i of arr){
        if(!flag){
            res += i;
            flag = true;
        }else{
            res+=","+i;
        }
    }
    return res;
}

export const getTimeText = (text: any)=>{
    const str = text.replace(' ','T');
    const time: any = new Date(str);
    const currentTime: any = new Date();
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

export const getStateText = (num: any) => {
    num = Number(num)
    if(num == 0) return 'waiting';
    if(num == 1) return 'judging';
    if(num == 2) return 'ac';
    if(num == 3) return 'wa';
    if(num == 4) return 'tle';
    if(num == 5) return 'mle';
    if(num == 6) return 're';
    if(num == 7) return 'uke';
    if(num == 8) return 'pc';
    if(num == 9) return 'se';
    if(num == 10) return 'ce';
    return "";
}

export const getRecordColor = (num: number) => {
    if(num == 1) return "blue";
    if(num == 2) return "blue";
    if(num == 3) return "pink";
    if(num == 4) return "red";
    if(num == 5) return "green";
}

export const getRecordText = (num: number) => {
    if(num == 1) return "Waiting";
    if(num == 2) return "Judging";
    if(num == 3) return "System Error";
    if(num == 4) return "Unaccepted";
    if(num == 5) return "Accepted";
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

export const getStateColor = (num: any) => {
    num = Number(num)
    if(num == 0) return 'grey';
    if(num == 1) return 'grey';
    if(num == 2) return 'green';
    if(num == 3) return 'red';
    if(num == 4) return 'light-blue-darken-4';
    if(num == 5) return 'light-blue-darken-4';
    if(num == 6) return 'purple';
    if(num == 7) return 'black';
    if(num == 8) return 'cyan-darken-4';
    if(num == 9) return 'pink';
    if(num == 10) return 'orange-darken-1';
    return 'light-blue-darken-4';
}

//判断tag是否应该显示
export const filterTag = (tid: number) => {
    return tid <= 1000;
}

export const getNowTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const day = ('0' + now.getDate()).slice(-2);
    const hours = ('0' + now.getHours()).slice(-2);
    const minutes = ('0' + now.getMinutes()).slice(-2);
    const seconds = ('0' + now.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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