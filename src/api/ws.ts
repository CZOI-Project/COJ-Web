import { useUserStore } from "@/store/user";
import { useGlobalStore } from "@/store/global";
import { WS } from "@/config";

export interface WSResult{
    event: string;
    option: string;
    target: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    time: number;
}

interface WSRequest{
    event: string;
    option: string;
    target: string;
}

type WSCallback = (obj: WSResult) => void;

//建立websocket连接
export const connect = async () => {
    try{
        await new Promise((resolve, reject) => {
            // 首先判断是否已经连接
            const globalStore = useGlobalStore();
            const userStore = useUserStore();
            if(globalStore.ws.isConnected){
                resolve(globalStore.ws);
                return;
            }
            // 然后尝试连接并挂载事件
            const socket = new WebSocket(WS + "/" + userStore.token);
            socket.onopen = () => {
                globalStore.ws.isConnected = true;
                console.log("Connected");
                resolve(socket);
            }
            socket.onclose = () => {
                globalStore.ws.isConnected = false;
                mdui.snackbar({
                    message: '与COJ实时通信服务器断开连接.'
                });
            }
            socket.onmessage = (e) => {
                const obj: WSResult = JSON.parse(e.data);
                const globalStore = useGlobalStore();
                let o;
                if(obj.event == "judger"){
                    o = obj.event; // 无target
                }else{
                    o = obj.event + obj.target;
                }
                if(globalStore.ws.events.has(o)){
                    const f: WSCallback = globalStore.ws.events.get(o);
                    f(obj);
                }
            }
            socket.onerror = (e) => {
                console.log(e);
                reject(e);
            }
            globalStore.ws.socket = socket;
        })
    }catch(err){
        console.error('connect failed',err);
    }
}

export function disConnect() {
    const globalStore = useGlobalStore();
    if(!globalStore.ws.isConnected) return;
    globalStore.ws.socket.close();
}

// 注册事件
export function subscribe(event: string, target: string, callback: WSCallback) {
    const globalStore = useGlobalStore();
    if(!globalStore.ws.isConnected) return;
    globalStore.ws.events.set(event + target, callback);
    const obj: WSRequest = { event: "subscribe", option: event, target: target }
    console.log(obj);
    globalStore.ws.socket.send(JSON.stringify(obj));
}

// 取消注册
export function cancel_subscribe(event: string, target: string) {
    const globalStore = useGlobalStore();
    if(!globalStore.ws.isConnected) return;
    if(globalStore.ws.events.has(event + target)){
        globalStore.ws.events.delete(event + target);
        const obj: WSRequest = { event: "cancel_subscribe", option: event, target: target }
        globalStore.ws.socket.send(JSON.stringify(obj));
    }
}